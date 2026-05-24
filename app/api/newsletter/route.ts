import { NextRequest, NextResponse } from "next/server";
import { db, initDb } from "@/lib/db";
import { resend, sendNewsletterWelcome } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    await initDb();
    try {
      await db.execute({ sql: "INSERT INTO newsletter (email) VALUES (?)", args: [email] });
    } catch { return NextResponse.json({ ok: true }); }
    await sendNewsletterWelcome(email);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: process.env.RESEND_TO_EMAIL ?? "jadedwheeler8@gmail.com",
      subject: "New newsletter signup",
      html: `<p>New signup: <strong>${email}</strong></p>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
