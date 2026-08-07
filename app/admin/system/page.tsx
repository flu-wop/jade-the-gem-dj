import { cookies } from "next/headers";
import Link from "next/link";
import { ADMIN_COOKIE, sessionToken } from "@/lib/admin-auth";
import AdminLoginForm from "@/components/AdminLoginForm";
import SystemHealthDashboard from "@/components/SystemHealthDashboard";

export const dynamic = "force-dynamic";

export default async function SystemPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE)?.value;

  if (!session || session !== sessionToken()) {
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ color: "#d4af37", letterSpacing: "0.1em" }}>System Health</h1>
        <Link href="/admin/" style={{ color: "#3aa898", fontSize: 13 }}>
          ← Back to Admin
        </Link>
      </div>
      <div style={{ marginTop: 24 }}>
        <SystemHealthDashboard />
      </div>
    </main>
  );
}
