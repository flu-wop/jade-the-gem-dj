// app/api/newsletter-engine/unsubscribe/route.ts
// One-click unsubscribe target for the List-Unsubscribe header and the
// footer link in every subscriber email. No auth beyond the signed token —
// that's the point of List-Unsubscribe=One-Click.

import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/newsletter-engine/tokens';
import { unsubscribeEmail } from '@/lib/newsletter-engine/db';
import { rateLimit, clientIp } from '@/lib/rate-limit';

function page(title: string, body: string) {
  return `<!DOCTYPE html><html><body style="font-family:sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#222">
    <h2>${title}</h2><p>${body}</p></body></html>`;
}

async function handle(req: NextRequest) {
  const ok = await rateLimit(`unsub:${clientIp(req)}`, 20, 600);
  if (!ok) {
    return new NextResponse(page('Too many requests', 'Please try again shortly.'), {
      status: 429,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const token = req.nextUrl.searchParams.get('token') ?? '';
  const verified = verifyUnsubscribeToken(token);
  if (!verified) {
    return new NextResponse(page('Link invalid or expired', 'Contact hello@dahiddengem.com and we\'ll remove you by hand.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  await unsubscribeEmail(verified.email);

  return new NextResponse(page('Unsubscribed', "You won't get any more newsletter emails from Epoch Skin."), {
    headers: { 'Content-Type': 'text/html' },
  });
}

// Mail clients doing List-Unsubscribe=One-Click send a POST; the footer link
// in the email itself is a plain GET. Support both against the same token.
export async function GET(req: NextRequest) {
  return handle(req);
}

export async function POST(req: NextRequest) {
  return handle(req);
}
