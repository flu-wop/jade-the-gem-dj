// app/api/newsletter-engine/approve/route.ts
// Reached from the two buttons in the draft review email. Two-step by
// design: GET renders a confirmation page (no side effects — safe for an
// email security scanner to prefetch, since prefetching can't click a
// button), and only the POST from that page's form actually executes the
// approve/reject. This is the fix for the failure mode where a link
// scanner silently "approves" a newsletter before a human ever sees it.

import { NextRequest, NextResponse } from 'next/server';
import { verifyIssueToken, signUnsubscribeToken } from '@/lib/newsletter-engine/tokens';
import { getIssueById, markIssueStatus, claimIssueForApproval, claimIssueForRejection, getActiveSubscribers } from '@/lib/newsletter-engine/db';
import { renderSubscriberEmail } from '@/lib/newsletter-engine/template';
import { newsletterConfig } from '@/lib/newsletter-engine/config';
import { getResend } from '@/lib/resend';

function page(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#222">
    <h2>${title}</h2><p>${body}</p></body></html>`;
}

function confirmPage(opts: {
  action: 'approve' | 'reject';
  token: string;
  subject: string;
  itemCount?: number;
  subscriberCount?: number;
}) {
  const { action, token, subject, itemCount, subscriberCount } = opts;
  const isApprove = action === 'approve';
  const heading = isApprove ? 'Send this issue?' : 'Reject this issue?';
  const detail = isApprove
    ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
       <p>${itemCount} item${itemCount === 1 ? '' : 's'} → <strong>${subscriberCount} subscriber${subscriberCount === 1 ? '' : 's'}</strong></p>
       <p style="color:#999;font-size:13px">This sends immediately and can't be undone.</p>`
    : `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
       <p style="color:#999;font-size:13px">This issue won't be sent. It stays in Turso for reference.</p>`;
  const buttonColor = isApprove ? '#C4974A' : '#B54848';
  const buttonLabel = isApprove ? 'Confirm & Send' : 'Confirm Reject';

  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#222">
    <h2>${heading}</h2>
    ${detail}
    <form method="POST" style="margin-top:24px">
      <input type="hidden" name="token" value="${escapeHtml(token)}" />
      <button type="submit" style="background:${buttonColor};color:#fff;border:none;padding:14px 32px;font-size:14px;font-weight:600;border-radius:4px;cursor:pointer">
        ${buttonLabel}
      </button>
    </form>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

// ── GET: side-effect-free confirmation screen ───────────────────────────
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token') ?? '';
  const verified = verifyIssueToken(token);
  if (!verified) {
    return new NextResponse(page('Link expired or invalid', 'Approve/reject links are single-purpose and expire after 7 days.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const { issueId, action } = verified;
  const issue = await getIssueById(issueId);
  if (!issue) {
    return new NextResponse(page('Issue not found', `#${issueId} doesn't exist.`), { status: 404, headers: { 'Content-Type': 'text/html' } });
  }

  if (issue.status !== 'draft') {
    return new NextResponse(
      page('Already handled', `Issue #${issueId} is already marked "${issue.status}".`),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  if (action === 'reject') {
    return new NextResponse(confirmPage({ action, token, subject: issue.subject ?? '(no subject)' }), {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const items = issue.sources_json ? JSON.parse(issue.sources_json) : [];
  if (!items.length || !issue.subject) {
    return new NextResponse(page('Nothing to send', `Issue #${issueId} has no items — was it a skip?`), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const subscribers = await getActiveSubscribers();
  return new NextResponse(
    confirmPage({ action, token, subject: issue.subject, itemCount: items.length, subscriberCount: subscribers.length }),
    { headers: { 'Content-Type': 'text/html' } }
  );
}

// ── POST: the actual mutation — only reachable by submitting the form above ──
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const token = String(form?.get('token') ?? '');
  const verified = verifyIssueToken(token);
  if (!verified) {
    return new NextResponse(page('Link expired or invalid', 'Approve/reject links are single-purpose and expire after 7 days.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const { issueId, action } = verified;
  const issue = await getIssueById(issueId);
  if (!issue) {
    return new NextResponse(page('Issue not found', `#${issueId} doesn't exist.`), { status: 404, headers: { 'Content-Type': 'text/html' } });
  }

  if (action === 'reject') {
    // Atomic claim: only transitions draft → rejected. If this issue was
    // already approved/rejected/sent — including by a second confirm
    // submitted concurrently — the claim fails harmlessly.
    const claimed = await claimIssueForRejection(issueId);
    if (!claimed) {
      return new NextResponse(
        page('Already handled', `Issue #${issueId} is already marked "${issue.status}".`),
        { headers: { 'Content-Type': 'text/html' } }
      );
    }
    return new NextResponse(page('Rejected', `Issue #${issueId} won't be sent.`), { headers: { 'Content-Type': 'text/html' } });
  }

  // action === 'approve'
  const items = issue.sources_json ? JSON.parse(issue.sources_json) : [];
  if (!items.length || !issue.subject) {
    return new NextResponse(page('Nothing to send', `Issue #${issueId} has no items — was it a skip?`), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Atomic claim: only one concurrent request can win this (draft →
  // approved) transition. Whoever doesn't win sees "already handled"
  // instead of both proceeding to send to the whole list.
  const claimed = await claimIssueForApproval(issueId);
  if (!claimed) {
    return new NextResponse(
      page('Already handled', `Issue #${issueId} is already marked "${issue.status}".`),
      { headers: { 'Content-Type': 'text/html' } }
    );
  }

  const subscribers = await getActiveSubscribers();
  const resend = getResend();
  const BATCH_SIZE = 100; // Resend batch send limit

  let sentCount = 0;
  const failures: string[] = [];

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const chunk = subscribers.slice(i, i + BATCH_SIZE);
    const emails = chunk.map((sub) => {
      const unsubToken = signUnsubscribeToken(sub.email);
      const unsubscribeUrl = `${newsletterConfig.siteUrl}/api/newsletter-engine/unsubscribe?token=${unsubToken}`;
      const rendered = renderSubscriberEmail(issue.subject!, items, unsubscribeUrl);
      return {
        from: newsletterConfig.fromEmail,
        to: sub.email,
        subject: issue.subject!,
        html: rendered.html,
        text: rendered.text,
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:${newsletterConfig.fromEmail}?subject=unsubscribe>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
      };
    });

    try {
      await resend.batch.send(emails);
      sentCount += emails.length;
    } catch (err) {
      console.error('[newsletter-engine] batch send failed:', err);
      failures.push(`batch starting at ${i}`);
    }
  }

  await markIssueStatus(issueId, 'sent');

  return new NextResponse(
    page(
      'Sent',
      `Issue #${issueId} went out to ${sentCount} subscriber${sentCount === 1 ? '' : 's'}.${
        failures.length ? ` ${failures.length} batch(es) failed — check logs.` : ''
      }`
    ),
    { headers: { 'Content-Type': 'text/html' } }
  );
}
