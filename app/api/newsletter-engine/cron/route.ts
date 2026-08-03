// app/api/newsletter-engine/cron/route.ts
// Triggered by Vercel Cron (see vercel.json). Phase 1 scope: generate a draft
// issue, store it in Turso, email James a review copy. No subscriber sends,
// no approve/reject links yet — that's Phase 2.

import { NextRequest, NextResponse } from 'next/server';
import { generateIssue } from '@/lib/newsletter-engine/generate';
import { insertIssue } from '@/lib/newsletter-engine/db';
import { renderDraftReviewEmail } from '@/lib/newsletter-engine/template';
import { newsletterConfig } from '@/lib/newsletter-engine/config';
import { getResend } from '@/lib/resend';
import { signIssueToken } from '@/lib/newsletter-engine/tokens';
import { timingSafeEqual } from 'crypto';

function safeEq(a: string, b: string): boolean {
  const A = Buffer.from(a), B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends this header automatically; also allow manual trigger
  // with the same secret for testing.
  const authHeader = req.headers.get('authorization') ?? '';
  const expected = `Bearer ${process.env.CRON_SECRET ?? ''}`;
  if (!process.env.CRON_SECRET || !safeEq(authHeader, expected)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await generateIssue();

    const issueId = result.skip
      ? await insertIssue({ client: newsletterConfig.client, status: 'skipped', skipReason: result.reason })
      : await insertIssue({
          client: newsletterConfig.client,
          status: 'draft',
          subject: result.subject,
          emailHtml: undefined, // final subscriber HTML gets rendered in Phase 2 from items
          blogTitle: result.blogTitle,
          blogMd: result.blogMd,
          sources: result.items,
        });

    const links = result.skip
      ? undefined
      : {
          approveUrl: `${newsletterConfig.siteUrl}/api/newsletter-engine/approve?token=${signIssueToken(issueId, 'approve')}`,
          rejectUrl: `${newsletterConfig.siteUrl}/api/newsletter-engine/approve?token=${signIssueToken(issueId, 'reject')}`,
        };
    const review = renderDraftReviewEmail(result, issueId, links);

    try {
      const resend = getResend();
      await resend.emails.send({
        from: newsletterConfig.fromEmail,
        to: newsletterConfig.approverEmail,
        subject: review.subject,
        html: review.html,
        text: review.text,
      });
    } catch (emailErr) {
      console.error('[newsletter-engine] review email failed:', emailErr);
      // Don't fail the whole run just because the notification email bounced —
      // the issue is already saved and visible in Turso either way.
    }

    return NextResponse.json({ success: true, issueId, skipped: result.skip });
  } catch (err) {
    console.error('[newsletter-engine] cron run failed:', err);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
