import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { ADMIN_COOKIE, safeEq, sessionToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const ok = await rateLimit(`admin-login:${clientIp(req)}`, 5, 900); // 5 per 15 min
  if (!ok) return NextResponse.json({ error: "Too many attempts" }, { status: 429 });

  const { password } = (await req.json().catch(() => ({}))) as { password?: string };
  const expected = process.env.ADMIN_PASSWORD ?? "";
  if (!password || !expected || !safeEq(String(password), expected)) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
  return res;
}
