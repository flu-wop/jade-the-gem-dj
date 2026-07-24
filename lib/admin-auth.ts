import { timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "jade_admin_session";

export function safeEq(a: string, b: string) {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

// The cookie value itself — never the raw password — proves the session.
// Deriving it from the password means no separate secret to manage, while
// still keeping the password out of the cookie (and out of logs/URLs).
export function sessionToken(): string {
  return Buffer.from(`jade-admin:${process.env.ADMIN_PASSWORD ?? ""}`).toString("base64");
}
