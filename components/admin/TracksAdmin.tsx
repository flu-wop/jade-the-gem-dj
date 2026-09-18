"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export interface AdminTrack {
  id: string;
  title: string;
  embed_src: string;
  is_featured: number;
  sort_order: number;
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

export default function TracksAdmin({ initialTracks }: { initialTracks: AdminTrack[] }) {
  const router = useRouter();
  const [tracks, setTracks] = useState(initialTracks);
  const [title, setTitle] = useState("");
  const [embedSrc, setEmbedSrc] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setEmbedSrc("");
    setIsFeatured(false);
    setError("");
  }

  function startEdit(t: AdminTrack) {
    setEditingId(t.id);
    setTitle(t.title);
    setEmbedSrc(t.embed_src);
    setIsFeatured(!!t.is_featured);
  }

  async function handleSave() {
    setError("");
    if (!title || !embedSrc) {
      setError("Title and SoundCloud embed URL are required.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tracks", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId || undefined,
          title,
          embedSrc,
          isFeatured,
          sortOrder: editingId ? tracks.find((t) => t.id === editingId)?.sort_order : tracks.length,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      const id = editingId || data.id;
      setTracks((prev) => {
        const next = prev.filter((t) => t.id !== id);
        next.push({
          id,
          title,
          embed_src: embedSrc,
          is_featured: isFeatured ? 1 : 0,
          sort_order: editingId ? (prev.find((t) => t.id === id)?.sort_order ?? prev.length) : prev.length,
        });
        return next.sort((a, b) => a.sort_order - b.sort_order);
      });
      resetForm();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this track?")) return;
    const res = await fetch("/api/admin/tracks", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setTracks((prev) => prev.filter((t) => t.id !== id));
      if (editingId === id) resetForm();
      router.refresh();
    }
  }

  return (
    <div style={{ display: "grid", gap: 32 }}>
      <div style={{ border: "1px solid #2a2336", borderRadius: 8, padding: 20 }}>
        <h3 style={{ color: "#d4af37", fontSize: 16, marginBottom: 16 }}>{editingId ? "Edit Track" : "Add Track"}</h3>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={labelStyle}>Title *</label>
            <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>SoundCloud embed src *</label>
            <input
              style={inputStyle}
              placeholder="https://w.soundcloud.com/player/?url=..."
              value={embedSrc}
              onChange={(e) => setEmbedSrc(e.target.value)}
            />
            <p style={{ color: "#6b6478", fontSize: 11, marginTop: 4 }}>
              On soundcloud.com: ··· → Share → Embed → copy the src= value from the iframe.
            </p>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6, color: "#c4b8e0", fontSize: 13 }}>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            Featured (shows as "Latest" on home + music page)
          </label>
        </div>

        {error && <p style={{ color: "#d4756b", fontSize: 12, marginTop: 12 }}>{error}</p>}

        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ background: "#d4af37", color: "#0e0b14", border: "none", borderRadius: 4, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            {saving ? "Saving…" : editingId ? "Save Changes" : "Add Track"}
          </button>
          {editingId && (
            <button onClick={resetForm} style={{ background: "none", border: "1px solid #2a2336", color: "#c4b8e0", borderRadius: 4, padding: "8px 16px", fontSize: 13, cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ color: "#3aa898", fontSize: 14, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
          Tracks ({tracks.length})
        </h3>
        {tracks.length === 0 ? (
          <p style={{ color: "#6b6478", fontSize: 13 }}>None yet.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {tracks.map((t) => (
              <div
                key={t.id}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, border: "1px solid #2a2336", borderRadius: 6, padding: "10px 14px" }}
              >
                <p style={{ color: "#f0ebe8", fontSize: 13, margin: 0 }}>
                  {t.title} {t.is_featured ? "★" : ""}
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => startEdit(t)} style={{ background: "none", border: "1px solid #2a2336", color: "#c4b8e0", borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(t.id)} style={{ background: "none", border: "1px solid #d4756b55", color: "#d4756b", borderRadius: 4, padding: "4px 10px", fontSize: 12, cursor: "pointer" }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
