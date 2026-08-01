import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, initDb } from "@/lib/db";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";
import { sendRsvpBroadcast } from "@/lib/resend";

async function isAdmin() {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE)?.value;
  return !!cookie && cookie === sessionToken();
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    eventId?: string; subject?: string; heading?: string; message?: string;
  };
  if (!body.eventId || !body.subject || !body.message) {
    return NextResponse.json({ error: "Missing eventId, subject, or message" }, { status: 400 });
  }

  await initDb();
  const r = await db.execute({
    sql: "SELECT DISTINCT name, email FROM rsvps WHERE event_id = ?",
    args: [body.eventId],
  });
  const recipients = r.rows as unknown as { name: string; email: string }[];

  let sent = 0;
  for (const guest of recipients) {
    try {
      await sendRsvpBroadcast({
        to: guest.email,
        name: guest.name,
        subject: body.subject,
        heading: body.heading || body.subject,
        message: body.message,
      });
      sent++;
    } catch (e) {
      console.error("Broadcast email failed for", guest.email, e);
    }
  }

  return NextResponse.json({ ok: true, totalRecipients: recipients.length, sent });
}
