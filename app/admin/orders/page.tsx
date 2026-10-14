import { db, initDb } from "@/lib/db";
import { isAuthed } from "@/lib/admin-auth";
import { AdminPage, AdminPageHeader, AdminLogin } from "@/components/admin/page-frame";
import DeleteRsvpButton from "@/components/DeleteRsvpButton";
import DeleteOrderButton from "@/components/DeleteOrderButton";
import ClearPendingButton from "@/components/ClearPendingButton";
import ReconcileTicketsButton from "@/components/ReconcileTicketsButton";
import ReconcileMerchButton from "@/components/ReconcileMerchButton";
import Accordion from "@/components/Accordion";

export const dynamic = "force-dynamic";
export const metadata = { title: "Bookings & Orders · Admin", robots: { index: false } };

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
    <span style={{ color, border: `1px solid ${color}55`, padding: "2px 8px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.14em", whiteSpace: "nowrap" }}>
      {s || "—"}
    </span>
  );
}

function CountBadge({ n, label }: { n: number; label?: string }) {
  return (
    <span style={{ color: "#c4b8e0", opacity: 0.6, fontSize: 12 }}>
      {n} {label || (n === 1 ? "item" : "items")}
    </span>
  );
}

export default async function AdminOrdersPage() {
  if (!(await isAuthed())) return <AdminLogin message="Enter the admin password to view bookings and orders." />;

  await initDb();
  const bookings = (await db.execute("SELECT * FROM bookings ORDER BY created_at DESC")).rows as Row[];
  const orders = (await db.execute("SELECT * FROM merch_orders ORDER BY created_at DESC")).rows as Row[];
  const playlists = (await db.execute("SELECT * FROM playlist_orders ORDER BY created_at DESC")).rows as Row[];
  const merchBuilds = (await db.execute("SELECT * FROM merch_build_orders ORDER BY created_at DESC")).rows as Row[];
  const tickets = (await db.execute("SELECT * FROM event_tickets ORDER BY created_at DESC")).rows as Row[];
  const rsvps = (await db.execute("SELECT * FROM rsvps ORDER BY created_at DESC")).rows as Row[];

  const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", color: "#c4b8e0", opacity: 0.7, fontWeight: 400, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.18em", whiteSpace: "nowrap" };
  const td: React.CSSProperties = { padding: "10px 12px", borderTop: "1px solid #2a2336", fontSize: 13, verticalAlign: "top", color: "#f0ebe8" };

  // Group RSVPs + tickets by event so guest lists read as "who's coming to
  // what" instead of two long flat tables mixing every event together.
  type EventGroup = { eventId: string; eventTitle: string; rsvps: Row[]; tickets: Row[]; lastActivity: string };
  const eventGroups = new Map<string, EventGroup>();
  for (const r of rsvps) {
    const key = String(r.event_id || r.event_title || "unknown");
    const g = eventGroups.get(key) ?? { eventId: key, eventTitle: String(r.event_title || key), rsvps: [], tickets: [], lastActivity: "" };
    g.rsvps.push(r);
    g.lastActivity = g.lastActivity > String(r.created_at || "") ? g.lastActivity : String(r.created_at || "");
    eventGroups.set(key, g);
  }
  for (const r of tickets) {
    const key = String(r.event_id || r.event_title || "unknown");
    const g = eventGroups.get(key) ?? { eventId: key, eventTitle: String(r.event_title || key), rsvps: [], tickets: [], lastActivity: "" };
    g.tickets.push(r);
    g.lastActivity = g.lastActivity > String(r.created_at || "") ? g.lastActivity : String(r.created_at || "");
    eventGroups.set(key, g);
  }
  const sortedEventGroups = [...eventGroups.values()].sort((a, b) => (a.lastActivity < b.lastActivity ? 1 : -1));

  return (
    <AdminPage>
      <AdminPageHeader eyebrow="Orders" title="Bookings & Orders" description="Guest lists, bookings, merch, playlists and merch builds." />

      {/* Guest lists — grouped by event */}
      <h2 className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] tracking-[0.2em] uppercase text-mist/80">
        Guest Lists
        <ClearPendingButton table="tickets" count={tickets.filter((r) => r.status === "pending").length} />
        <ReconcileTicketsButton />
      </h2>
      {sortedEventGroups.length === 0 && (
        <p className="mt-3 text-sm text-mist/60 bg-surface border border-[#2a2336] p-6 text-center">No RSVPs or ticket sales yet.</p>
      )}
      {sortedEventGroups.map((g) => {
        const guestCount = g.tickets.length + g.rsvps.reduce((sum, r) => sum + Number(r.guests || 1), 0);
        return (
          <Accordion
            key={g.eventId}
            title={g.eventTitle}
            defaultOpen={sortedEventGroups.length === 1}
            badge={
              <CountBadge
                n={guestCount}
                label={`${guestCount === 1 ? "guest" : "guests"} · ${g.tickets.length} ticket${g.tickets.length === 1 ? "" : "s"} · ${g.rsvps.length} RSVP${g.rsvps.length === 1 ? "" : "s"}`}
              />
            }
          >
            {g.tickets.length > 0 && (
              <>
                <h3 style={{ color: "#c4b8e0", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 16 }}>
                  Tickets ({g.tickets.length})
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, minWidth: 640 }}>
                    <thead>
                      <tr>
                        <th style={th}>When</th><th style={th}>Name</th><th style={th}>Email</th>
                        <th style={th}>Phone</th><th style={th}>Paid</th><th style={th}>Status</th><th style={th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.tickets.map((r) => (
                        <tr key={String(r.id)}>
                          <td style={td}>{String(r.created_at || "")}</td>
                          <td style={td}>{String(r.name || "")}</td>
                          <td style={td}>{String(r.email || "")}</td>
                          <td style={td}>{String(r.phone || "—")}</td>
                          <td style={td}>{money(r.amount_cents)}</td>
                          <td style={td}><StatusPill status={r.status} /></td>
                          <td style={td}><DeleteOrderButton table="tickets" id={r.id as number} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {g.rsvps.length > 0 && (
              <>
                <h3 style={{ color: "#c4b8e0", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", marginTop: 24 }}>
                  RSVPs ({g.rsvps.length})
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8, minWidth: 680 }}>
                    <thead>
                      <tr>
                        <th style={th}>When</th><th style={th}>Name</th><th style={th}>Email</th>
                        <th style={th}>Phone</th><th style={th}>Guests</th><th style={th}>Message</th><th style={th}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.rsvps.map((r) => (
                        <tr key={String(r.id)}>
                          <td style={td}>{String(r.created_at || "")}</td>
                          <td style={td}>{String(r.name || "")}</td>
                          <td style={td}>{String(r.email || "")}</td>
                          <td style={td}>{String(r.phone || "—")}</td>
                          <td style={td}>{String(r.guests || 1)}</td>
                          <td style={td}>{String(r.message || "—")}</td>
                          <td style={td}><DeleteRsvpButton id={r.id as number} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </Accordion>
        );
      })}

      <h2 className="mt-10 text-[11px] tracking-[0.2em] uppercase text-mist/80">Orders</h2>

      {/* Bookings */}
      <Accordion title="Bookings" badge={<CountBadge n={bookings.length} />}>
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
      </Accordion>

      {/* Merch orders */}
      <Accordion
        title="Merch Orders"
        badge={
          <>
            <CountBadge n={orders.length} />
            <ClearPendingButton table="merch" count={orders.filter((r) => r.status === "pending").length} />
            <ReconcileMerchButton />
          </>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, minWidth: 760 }}>
            <thead>
              <tr>
                <th style={th}>When</th><th style={th}>Name</th><th style={th}>Email</th>
                <th style={th}>Items</th><th style={th}>Paid</th><th style={th}>Code</th>
                <th style={th}>Ship To</th><th style={th}>Printify</th><th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td style={td} colSpan={10}>No orders yet.</td></tr>
              ) : orders.map((r) => {
                let items = "";
                try {
                  const parsed = JSON.parse(String(r.items || "[]")) as Array<Record<string, unknown>>;
                  items = parsed
                    .map((l) => {
                      // New shape: {name, variantName, qty}. Old orders placed
                      // before the live-Printify rebuild used {name, style, size, qty} —
                      // handle both so historical rows still render.
                      const variant = String(l.variantName ?? [l.style, l.size].filter(Boolean).join(" "));
                      return `${l.name} (${variant}) ×${l.qty}`;
                    })
                    .join("; ");
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
                    <td style={td}>{String(r.discount_code || "")}</td>
                    <td style={td}>{ship}</td>
                    <td style={td}>{String(r.printify_order_id || "—")}</td>
                    <td style={td}><StatusPill status={r.status} /></td>
                    <td style={td}><DeleteOrderButton table="merch" id={r.id as number} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Accordion>

      {/* Playlist orders */}
      <Accordion
        title="Playlist Orders"
        badge={
          <>
            <CountBadge n={playlists.length} />
            <ClearPendingButton table="playlist" count={playlists.filter((r) => r.status === "pending").length} />
          </>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, minWidth: 600 }}>
            <thead>
              <tr>
                <th style={th}>When</th><th style={th}>Tier</th><th style={th}>Name</th>
                <th style={th}>Email</th><th style={th}>Paid</th><th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {playlists.length === 0 ? (
                <tr><td style={td} colSpan={7}>No playlist orders yet.</td></tr>
              ) : playlists.map((r) => (
                <tr key={String(r.id)}>
                  <td style={td}>{String(r.created_at || "")}</td>
                  <td style={td}>{String(r.tier || "")}</td>
                  <td style={td}>{String(r.name || "")}</td>
                  <td style={td}>{String(r.email || "")}</td>
                  <td style={td}>{money(r.amount_cents)}</td>
                  <td style={td}><StatusPill status={r.status} /></td>
                  <td style={td}><DeleteOrderButton table="playlist" id={r.id as number} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>

      {/* Merch build orders */}
      <Accordion
        title="Merch Build Orders"
        badge={
          <>
            <CountBadge n={merchBuilds.length} />
            <ClearPendingButton table="merch-build" count={merchBuilds.filter((r) => r.status === "pending").length} />
          </>
        }
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12, minWidth: 640 }}>
            <thead>
              <tr>
                <th style={th}>When</th><th style={th}>Tier</th><th style={th}>Items</th>
                <th style={th}>Name</th><th style={th}>Email</th><th style={th}>Paid</th><th style={th}>Status</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {merchBuilds.length === 0 ? (
                <tr><td style={td} colSpan={8}>No merch build orders yet.</td></tr>
              ) : merchBuilds.map((r) => (
                <tr key={String(r.id)}>
                  <td style={td}>{String(r.created_at || "")}</td>
                  <td style={td}>{String(r.tier || "")}</td>
                  <td style={td}>{String(r.item_count || "")}</td>
                  <td style={td}>{String(r.name || "")}</td>
                  <td style={td}>{String(r.email || "")}</td>
                  <td style={td}>{money(r.amount_cents)}</td>
                  <td style={td}><StatusPill status={r.status} /></td>
                  <td style={td}><DeleteOrderButton table="merch-build" id={r.id as number} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Accordion>
    </AdminPage>
  );
}
