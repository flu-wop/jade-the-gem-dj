import { isAuthed } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/AdminLoginForm";
import SystemHealthDashboard from "@/components/SystemHealthDashboard";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  if (!(await isAuthed())) {
    return (
      <main style={{ minHeight: "100vh", background: "#0e0b14", color: "#f0ebe8", fontFamily: "system-ui", padding: 48 }}>
        <h1 style={{ color: "#d4af37" }}>Admin Login</h1>
        <p style={{ color: "#c4b8e0" }}>Enter the admin password to view system health.</p>
        <AdminLoginForm />
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "#0e0b14", color: "#f0ebe8", fontFamily: "system-ui", padding: "48px 32px" }}>
      <h1 style={{ color: "#d4af37", letterSpacing: "0.1em" }}>System Health</h1>
      <div style={{ marginTop: 24 }}>
        <SystemHealthDashboard />
      </div>
    </main>
  );
}
