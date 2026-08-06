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
    videoUrl?: string; videoThumbnailUrl?: string;
    testEmails?: string[]; // when present, sends only to these instead of DB recipients
  };
  if (!body.subject || !body.message) {
    return NextResponse.json({ error: "Missing subject or message" }, { status: 400 });
  }

  await initDb();

  let recipients: { name: string; email: string }[];

  if (body.testEmails?.length) {
    recipients = body.testEmails.map((email) => ({ name: "there", email }));
  } else {
    if (!body.eventId) {
      return NextResponse.json({ error: "Missing eventId" }, { status: 400 });
    }
    const rsvpRows = await db.execute({
      sql: "SELECT DISTINCT name, email FROM rsvps WHERE event_id = ?",
      args: [body.eventId],
    });
    const ticketRows = await db.execute({
      sql: "SELECT DISTINCT name, email FROM event_tickets WHERE event_id = ? AND status = 'paid'",
      args: [body.eventId],
    });
    // Merge + dedupe by email across both sources (an event might use either flow).
    const byEmail = new Map<string, { name: string; email: string }>();
    for (const row of [...rsvpRows.rows, ...ticketRows.rows] as unknown as { name: string; email: string }[]) {
      if (row.email) byEmail.set(row.email.toLowerCase(), row);
    }
    recipients = [...byEmail.values()];
  }

  let sent = 0;
  for (const guest of recipients) {
    try {
      await sendRsvpBroadcast({
        to: guest.email,
        name: guest.name,
        subject: body.subject,
        heading: body.heading || body.subject,
        message: body.message,
        videoUrl: body.videoUrl,
        videoThumbnailUrl: body.videoThumbnailUrl,
      });
      sent++;
    } catch (e) {
      console.error("Broadcast email failed for", guest.email, e);
    }
  }

  return NextResponse.json({ ok: true, totalRecipients: recipients.length, sent });
}
