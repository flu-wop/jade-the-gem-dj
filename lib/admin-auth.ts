import { cookies } from "next/headers";
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

// Shared check for every admin page/route — replaces the raw
// `session !== sessionToken()` comparison that was copy-pasted into each
// page (and wasn't even using safeEq, so it wasn't timing-safe).
export async function isAuthed(): Promise<boolean> {
  const store = await cookies();
  const session = store.get(ADMIN_COOKIE)?.value;
  if (!session) return false;
  return safeEq(session, sessionToken());
}
