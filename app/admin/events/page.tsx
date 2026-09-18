import { isAuthed } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/AdminLoginForm";
import { getAllEvents, initDb } from "@/lib/db";
import EventsAdmin from "@/components/admin/EventsAdmin";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  if (!(await isAuthed())) {
    return (
      <main style={{ minHeight: "100vh", background: "#0e0b14", color: "#f0ebe8", fontFamily: "system-ui", padding: 48 }}>
        <h1 style={{ color: "#d4af37" }}>Admin Login</h1>
        <p style={{ color: "#c4b8e0" }}>Enter the admin password to manage events.</p>
        <AdminLoginForm />
      </main>
    );
  }

  await initDb();
  const events = await getAllEvents();

  return (
    <main style={{ minHeight: "100vh", background: "#0e0b14", color: "#f0ebe8", fontFamily: "system-ui", padding: "32px clamp(16px, 5vw, 48px)" }}>
      <h1 style={{ color: "#d4af37", marginBottom: 4 }}>Events</h1>
      <p style={{ color: "#6b6478", fontSize: 13, marginBottom: 28 }}>
        Add, edit, or remove shows. Upcoming vs. past is decided automatically by date.
      </p>
      <EventsAdmin initialEvents={events} />
    </main>
  );
}
