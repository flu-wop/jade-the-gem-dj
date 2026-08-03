// lib/newsletter-engine/tokens.ts
// Stateless signed tokens for approve/reject/unsubscribe links, per the
// site-security skill pattern already used in lib/admin-auth.ts.

import { createHmac, timingSafeEqual } from 'crypto';

function secret(): string {
  const s = process.env.NEWSLETTER_SECRET;
  if (!s) throw new Error('NEWSLETTER_SECRET not configured');
  return s;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

function safeEq(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

// ── Issue approve/reject tokens — payload: id:action:exp ───────────────────

export function signIssueToken(issueId: number, action: 'approve' | 'reject', ttlSeconds = 7 * 24 * 3600): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${issueId}:${action}:${exp}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyIssueToken(token: string): { issueId: number; action: 'approve' | 'reject' } | null {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(b64, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (!safeEq(sign(payload), sig)) return null;

  const [idStr, action, expStr] = payload.split(':');
  const exp = Number(expStr);
  if (!idStr || !action || !exp || Date.now() / 1000 > exp) return null;
  if (action !== 'approve' && action !== 'reject') return null;

  return { issueId: Number(idStr), action };
}

// ── Subscriber unsubscribe tokens — payload: email:exp ──────────────────────

export function signUnsubscribeToken(email: string): string {
  const exp = Math.floor(Date.now() / 1000) + 365 * 24 * 3600; // long-lived, sits in inboxes
  const payload = `${email}:${exp}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
}

export function verifyUnsubscribeToken(token: string): { email: string } | null {
  const [b64, sig] = token.split('.');
  if (!b64 || !sig) return null;
  let payload: string;
  try {
    payload = Buffer.from(b64, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (!safeEq(sign(payload), sig)) return null;

  const [email, expStr] = payload.split(':');
  const exp = Number(expStr);
  if (!email || !exp || Date.now() / 1000 > exp) return null;

  return { email };
}
