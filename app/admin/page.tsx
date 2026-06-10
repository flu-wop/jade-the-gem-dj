import { db, initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function money(cents: unknown) {
  return `$${(Number(cents || 0) / 100).toFixed(2)}`;
}

function StatusPill({ status }: { status: unknown }) {
  const s = String(status || "");
  const color =
    s === "confirmed" || s === "fulfilled"
      ? "#3aa898"
      : s === "fulfill_failed"
      ? "#d4af37"
      : "#6355b8";
  return (
    <span style={{ color, border: `1px solid ${color}55`, padding: "2px 8px", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em" }}>
      {s || "—"}
    </span>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;

  if (key !== process.env.ADMIN_PASSWORD) {
    return (
      <main style={{ minHeight: "100vh", background: "#0e0b14", color: "#f0ebe8", fontFamily: "system-ui", padding: 48 }}>
        <h1 style={{ color: "#d4af37" }}>Unauthorized</h1>
        <p style={{ color: "#c4b8e0" }}>
          Append <code>?key=YOUR_ADMIN_PASSWORD</code> to the URL.
        </p>
      </main>
    );
  }

  await initDb();
  const bookings = (await db.execute("SELECT * FROM bookings ORDER BY created_at DESC")).rows as Row[];
  const orders = (await db.execute("SELECT * FROM merch_orders ORDER BY created_at DESC")).rows as Row[];

  const th: React.CSSProperties = { textAlign: "left", padding: "8px 10px", color: "#A89880", fontWeight: 400, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.08em" };
  const td: React.CSSProperties = { padding: "8px 10px", borderTop: "1px solid #2a2336", fontSize: 13, verticalAlign: "top" };

  return (
    <main style={{ minHeight: "100vh", background: "#0e0b14", color: "#f0ebe8", fontFamily: "system-ui", padding: "48px 32px" }}>
      <h1 style={{ color: "#d4af37", letterSpacing: "0.1em" }}>Jade — Admin</h1>

      {/* Bookings */}
      <section style={{ marginTop: 32 }}>
        <h2 style={{ color: "#3aa898" }}>Bookings ({bookings.length})</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, minWidth: 760 }}>
            <thead>
              <tr>
                <th style={th}>Date</th><th style={th}>Type</th><th style={th}>Hrs</th>
                <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Phone</th>
                <th style={th}>Location</th><th style={th}>Paid</th><th style={th}>Code</th>
                <th style={th}>Status</th><th style={th}>Booked</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td style={td} colSpan={11}>No bookings yet.</td></tr>
              ) : bookings.map((r) => (
                <tr key={String(r.id)}>
                  <td style={td}>{String(r.event_date || "")}</td>
                  <td style={td}>{String(r.event_type || "")}</td>
                  <td style={td}>{String(r.hours || "")}</td>
                  <td style={td}>{String(r.name || "")}</td>
                  <td style={td}>{String(r.email || "")}</td>
                  <td style={td}>{String(r.phone || "")}</td>
                  <td style={td}>{String(r.location || "")}</td>
                  <td style={td}>{money(r.amount_cents)}</td>
                  <td style={td}>{String(r.discount_code || "")}</td>
                  <td style={td}><StatusPill status={r.status} /></td>
                  <td style={td}>{String(r.created_at || "")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Merch orders */}
      <section style={{ marginTop: 48 }}>
        <h2 style={{ color: "#3aa898" }}>Merch Orders ({orders.length})</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, minWidth: 760 }}>
            <thead>
              <tr>
                <th style={th}>When</th><th style={th}>Name</th><th style={th}>Email</th>
                <th style={th}>Items</th><th style={th}>Paid</th>
                <th style={th}>Ship To</th><th style={th}>Printify</th><th style={th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td style={td} colSpan={8}>No orders yet.</td></tr>
              ) : orders.map((r) => {
                let items = "";
                try {
                  const parsed = JSON.parse(String(r.items || "[]")) as Array<{ name: string; style: string; size: string; qty: number }>;
                  items = parsed.map((l) => `${l.name} (${l.style} ${l.size}) ×${l.qty}`).join("; ");
                } catch { items = String(r.items || ""); }
                let ship = "";
                try {
                  const a = JSON.parse(String(r.shipping_json || "{}")) as Record<string, string>;
                  ship = [a.line1, a.line2, a.city, a.state, a.postal_code, a.country].filter(Boolean).join(", ");
                } catch { /* ignore */ }
                return (
                  <tr key={String(r.id)}>
                    <td style={td}>{String(r.created_at || "")}</td>
                    <td style={td}>{String(r.name || "")}</td>
                    <td style={td}>{String(r.email || "")}</td>
                    <td style={td}>{items}</td>
                    <td style={td}>{money(r.amount_cents)}</td>
                    <td style={td}>{ship}</td>
                    <td style={td}>{String(r.printify_order_id || "—")}</td>
                    <td style={td}><StatusPill status={r.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
