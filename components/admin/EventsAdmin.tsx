"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

export interface AdminEvent {
  id: string;
  title: string;
  date: string;
  time: string | null;
  venue: string;
  city: string;
  state: string;
  flyer_url: string;
  ticket_link: string | null;
  rsvp_required: number;
  rsvp_capacity: number | null;
  ticket_price: number | null;
  ticket_capacity: number | null;
  featured: number;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#17121f",
  border: "1px solid #2a2336",
  borderRadius: 4,
  color: "#f0ebe8",
  padding: "8px 10px",
  fontSize: 13,
};
const labelStyle: React.CSSProperties = {
  display: "block",
  color: "#6b6478",
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  marginBottom: 4,
};

const BLANK = {
  id: "",
  title: "",
  date: "",
  time: "",
  venue: "",
  city: "New Orleans",
  state: "LA",
  flyerUrl: "",
  ticketLink: "",
  rsvpRequired: false,
  rsvpCapacity: "",
  ticketPrice: "",
  ticketCapacity: "",
  featured: false,
};

export default function EventsAdmin({ initialEvents }: { initialEvents: AdminEvent[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initialEvents);
  const [form, setForm] = useState(BLANK);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [error, setError] = useState("");
  // Bumped on every resetForm() so the file <input> below remounts —
  // it's an uncontrolled DOM element, so clearing form.flyerUrl in React
  // state does NOT clear the browser's own displayed filename. Without
  // this, the input still visually shows the last-chosen file after a
  // save/cancel, even though flyerUrl is genuinely empty — which is what
  // made a second "Add Event" silently fail the required-fields check.
  const [fileInputKey, setFileInputKey] = useState(0);

  function startEdit(e: AdminEvent) {
    setEditingId(e.id);
    setFileInputKey((k) => k + 1);
    setForm({
      id: e.id,
      title: e.title,
      date: e.date,
      time: e.time ?? "",
      venue: e.venue,
      city: e.city,
      state: e.state,
      flyerUrl: e.flyer_url,
      ticketLink: e.ticket_link ?? "",
      rsvpRequired: !!e.rsvp_required,
      rsvpCapacity: e.rsvp_capacity?.toString() ?? "",
      ticketPrice: e.ticket_price ? (e.ticket_price / 100).toString() : "",
      ticketCapacity: e.ticket_capacity?.toString() ?? "",
      featured: !!e.featured,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(BLANK);
    setError("");
    setUploadError("");
    setFileInputKey((k) => k + 1);
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setUploadError("");
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "flyer";
      const blob = await upload(`flyers/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type || "application/octet-stream",
      });
      setForm((f) => ({ ...f, flyerUrl: blob.url }));
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setError("");
    if (!form.title || !form.date || !form.venue || !form.city || !form.state || !form.flyerUrl) {
      setError("Title, date, venue, city, state, and a flyer image are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        id: editingId || undefined,
        title: form.title,
        date: form.date,
        time: form.time || undefined,
        venue: form.venue,
        city: form.city,
        state: form.state,
        flyerUrl: form.flyerUrl,
        ticketLink: form.ticketLink || undefined,
        rsvpRequired: form.rsvpRequired,
        rsvpCapacity: form.rsvpCapacity ? Number(form.rsvpCapacity) : null,
        ticketPrice: form.ticketPrice ? Math.round(Number(form.ticketPrice) * 100) : null,
        ticketCapacity: form.ticketCapacity ? Number(form.ticketCapacity) : null,
        featured: form.featured,
      };
      const res = await fetch("/api/admin/events", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      resetForm();
      router.refresh();
      // Optimistic local update so the list reflects the change immediately.
      const id = editingId || data.id;
      setEvents((prev) => {
        const next = prev.filter((e) => e.id !== id);
        next.push({
          id,
          title: payload.title,
          date: payload.date,
          time: payload.time ?? null,
          venue: payload.venue,
          city: payload.city,
          state: payload.state,
          flyer_url: payload.flyerUrl,
          ticket_link: payload.ticketLink ?? null,
          rsvp_required: payload.rsvpRequired ? 1 : 0,
          rsvp_capacity: payload.rsvpCapacity,
          ticket_price: payload.ticketPrice,
          ticket_capacity: payload.ticketCapacity,
          featured: payload.featured ? 1 : 0,
        });
        return next.sort((a, b) => b.date.localeCompare(a.date));
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this event? This can't be undone.")) return;
    const res = await fetch("/api/admin/events", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      if (editingId === id) resetForm();
      router.refresh();
    }
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div style={{ display: "grid", gap: 32 }}>
      {/* ── Form ── */}
      <div style={{ border: "1px solid #2a2336", borderRadius: 8, padding: 20 }}>
        <h3 style={{ color: "#d4af37", fontSize: 16, marginBottom: 16 }}>
          {editingId ? "Edit Event" : "Add Event"}
        </h3>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Date *</label>
            <input type="date" style={inputStyle} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Time</label>
            <input placeholder="10:00 PM" style={inputStyle} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Venue *</label>
            <input style={inputStyle} value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>City *</label>
            <input style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>State *</label>
            <input style={inputStyle} value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={labelStyle}>Flyer image *</label>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              key={fileInputKey}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
              style={{ fontSize: 12, color: "#c4b8e0" }}
            />
            {uploading && <span style={{ color: "#6b6478", fontSize: 12 }}>Uploading…</span>}
            {form.flyerUrl && !uploading && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.flyerUrl} alt="Flyer preview" style={{ height: 48, borderRadius: 4 }} />
            )}
          </div>
          {uploadError && <p style={{ color: "#d4756b", fontSize: 12, marginTop: 6 }}>{uploadError}</p>}
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 12 }}>
          <div>
            <label style={labelStyle}>Ticket link (external)</label>
            <input style={inputStyle} value={form.ticketLink} onChange={(e) => setForm({ ...form, ticketLink: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Ticket price ($, on-site checkout)</label>
            <input type="number" style={inputStyle} value={form.ticketPrice} onChange={(e) => setForm({ ...form, ticketPrice: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>Ticket capacity</label>
            <input type="number" style={inputStyle} value={form.ticketCapacity} onChange={(e) => setForm({ ...form, ticketCapacity: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>RSVP capacity</label>
            <input type="number" style={inputStyle} value={form.rsvpCapacity} onChange={(e) => setForm({ ...form, rsvpCapacity: e.target.value })} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#c4b8e0", fontSize: 13 }}>
            <input type="checkbox" checked={form.rsvpRequired} onChange={(e) => setForm({ ...form, rsvpRequired: e.target.checked })} />
            RSVP required (private address)
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#c4b8e0", fontSize: 13 }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
            Featured
          </label>
        </div>

        {error && <p style={{ color: "#d4756b", fontSize: 12, marginTop: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            style={{ background: "#d4af37", color: "#0e0b14", border: "none", borderRadius: 4, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add Event"}
          </button>
          {editingId && (
            <button onClick={resetForm} style={{ background: "none", border: "1px solid #2a2336", color: "#c4b8e0", borderRadius: 4, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* ── Lists ── */}
      <EventList title="Upcoming" events={upcoming} onEdit={startEdit} onDelete={handleDelete} accent="#3aa898" />
      <EventList title="Past" events={past} onEdit={startEdit} onDelete={handleDelete} accent="#6b6478" />
    </div>
  );
}

function EventList({
  title,
  events,
  onEdit,
  onDelete,
  accent,
}: {
  title: string;
  events: AdminEvent[];
  onEdit: (e: AdminEvent) => void;
  onDelete: (id: string) => void;
  accent: string;
}) {
  return (
    <div>
      <h3 style={{ color: accent, fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
        {title} ({events.length})
      </h3>
      {events.length === 0 ? (
        <p style={{ color: "#6b6478", fontSize: 13 }}>None yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 8 }}>
          {events.map((e) => (
            <div
              key={e.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                border: "1px solid #2a2336", borderRadius: 6, padding: "10px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.flyer_url} alt="" style={{ width: 36, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ color: "#f0ebe8", fontSize: 13, margin: 0 }}>
                    {e.title} {e.featured ? "★" : ""}
                  </p>
                  <p style={{ color: "#6b6478", fontSize: 12, margin: 0 }}>
                    {e.date} · {e.venue}, {e.city}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => onEdit(e)} style={{ background: "none", border: "1px solid #2a2336", color: "#c4b8e0", borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                  Edit
                </button>
                <button onClick={() => onDelete(e.id)} style={{ background: "none", border: "1px solid #d4756b55", color: "#d4756b", borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
