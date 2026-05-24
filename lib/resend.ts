import { Resend } from "resend";
export const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmation({
  name, email, eventDate, eventType, hours, location, total, discountCode,
}: {
  name: string; email: string; eventDate: string; eventType: string;
  hours: number; location: string; total: number; discountCode?: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const to_jade = process.env.RESEND_TO_EMAIL ?? "jadedwheeler8@gmail.com";

  await resend.emails.send({
    from, to: email,
    subject: "Booking Confirmed — DJ Jade the Gem 💎",
    html: `<div style="font-family:sans-serif;background:#0e0b14;color:#f0ebe8;padding:40px;max-width:580px;margin:0 auto;">
      <h1 style="color:#3aa898;font-size:28px;margin-bottom:4px;">You're booked! 💎</h1>
      <p style="color:#888;margin-bottom:28px;">DJ Jade the Gem — Hidden Gem</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;">Name</td><td style="padding:10px 0;border-bottom:1px solid #222;">${name}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;">Event Date</td><td style="padding:10px 0;border-bottom:1px solid #222;">${eventDate}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;">Event Type</td><td style="padding:10px 0;border-bottom:1px solid #222;">${eventType}</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;">Hours</td><td style="padding:10px 0;border-bottom:1px solid #222;">${hours} hours</td></tr>
        <tr><td style="padding:10px 0;border-bottom:1px solid #222;color:#888;">Location</td><td style="padding:10px 0;border-bottom:1px solid #222;">${location}</td></tr>
        <tr><td style="padding:10px 0;color:#888;">Total Paid</td><td style="padding:10px 0;color:#3aa898;font-weight:bold;">$${total}</td></tr>
      </table>
      ${discountCode ? `<p style="color:#3aa898;margin-top:16px;">Discount code <strong>${discountCode}</strong> applied ✓</p>` : ""}
      <p style="margin-top:32px;color:#666;">Questions? <a href="mailto:jadedwheeler8@gmail.com" style="color:#3aa898;">jadedwheeler8@gmail.com</a></p>
    </div>`,
  });

  await resend.emails.send({
    from, to: to_jade,
    subject: `New Booking: ${name} — ${eventDate}`,
    html: `<div style="font-family:sans-serif;background:#0e0b14;color:#f0ebe8;padding:40px;">
      <h1 style="color:#3aa898;">New Booking 💎</h1>
      <p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p>
      <p><strong>Date:</strong> ${eventDate}</p><p><strong>Type:</strong> ${eventType}</p>
      <p><strong>Hours:</strong> ${hours}</p><p><strong>Location:</strong> ${location}</p>
      <p><strong>Total:</strong> $${total}</p>
      ${discountCode ? `<p><strong>Code:</strong> ${discountCode}</p>` : ""}
    </div>`,
  });
}

export async function sendNewsletterWelcome(email: string) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to: email,
    subject: "Welcome to the Hidden Gem fam 💎",
    html: `<div style="font-family:sans-serif;background:#0e0b14;color:#f0ebe8;padding:40px;max-width:580px;">
      <h1 style="color:#3aa898;">You're in. 💎</h1>
      <p>Thanks for joining the Hidden Gem list. You'll be first to know about new events, drops, and mixes.</p>
      <p style="color:#666;margin-top:24px;">— Jade</p>
    </div>`,
  });
}
