import { isAuthed } from "@/lib/admin-auth";
import { getAllEvents, initDb } from "@/lib/db";
import EventsAdmin from "@/components/admin/EventsAdmin";
import { AdminPage, AdminPageHeader, AdminLogin } from "@/components/admin/page-frame";

export const dynamic = "force-dynamic";
export const metadata = { title: "Events · Admin", robots: { index: false } };

export default async function AdminEventsPage() {
  if (!(await isAuthed())) return <AdminLogin message="Enter the admin password to manage events." />;

  await initDb();
  const events = await getAllEvents();

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Shows" title="Events" description="Add, edit, or remove shows. Upcoming vs. past is decided automatically by date." />
      <EventsAdmin initialEvents={JSON.parse(JSON.stringify(events))} />
    </AdminPage>
  );
}
