import { isAuthed } from "@/lib/admin-auth";
import SystemHealthDashboard from "@/components/SystemHealthDashboard";
import { AdminPage, AdminPageHeader, AdminLogin } from "@/components/admin/page-frame";

export const dynamic = "force-dynamic";
export const metadata = { title: "System · Admin", robots: { index: false } };

export default async function SystemPage() {
  if (!(await isAuthed())) return <AdminLogin message="Enter the admin password to view system health." />;

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Admin" title="System" description="Env vars, webhooks and integrations — is everything actually working." />
      <SystemHealthDashboard />
    </AdminPage>
  );
}
