import { isAuthed } from "@/lib/admin-auth";
import { getSetting, initDb } from "@/lib/db";
import HeroVideoAdmin from "@/components/admin/HeroVideoAdmin";
import { AdminPage, AdminPageHeader, AdminLogin } from "@/components/admin/page-frame";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings · Admin", robots: { index: false } };

export default async function AdminSettingsPage() {
  if (!(await isAuthed())) return <AdminLogin message="Enter the admin password to manage site settings." />;

  await initDb();
  const heroVideoUrl = await getSetting("hero_video_url");

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Site" title="Settings" description="Content that doesn't fit anywhere else." />
      <HeroVideoAdmin initialUrl={heroVideoUrl} />
    </AdminPage>
  );
}
