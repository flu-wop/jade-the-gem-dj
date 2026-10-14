import { isAuthed } from "@/lib/admin-auth";
import { getAllTracks, initDb } from "@/lib/db";
import TracksAdmin from "@/components/admin/TracksAdmin";
import { AdminPage, AdminPageHeader, AdminLogin } from "@/components/admin/page-frame";

export const dynamic = "force-dynamic";
export const metadata = { title: "Releases · Admin", robots: { index: false } };

export default async function AdminTracksPage() {
  if (!(await isAuthed())) return <AdminLogin message="Enter the admin password to manage releases." />;

  await initDb();
  const tracks = await getAllTracks();

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Music" title="Releases" description="Add new mixes and tracks — no code changes or redeploy needed." />
      <TracksAdmin initialTracks={JSON.parse(JSON.stringify(tracks))} />
    </AdminPage>
  );
}
