"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroVideoAdmin({ initialUrl }: { initialUrl: string | null }) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    setError("");
    setSaved(false);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "hero-video");
      const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_video_url", value: uploadData.url }),
      });
      if (!saveRes.ok) throw new Error("Saved the file but failed to update the setting.");

      setUrl(uploadData.url);
      setSaved(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleClear() {
    if (!confirm("Remove the hero video and fall back to the static photo?")) return;
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "hero_video_url", value: "" }),
    });
    if (res.ok) {
      setUrl("");
      setSaved(true);
      router.refresh();
    }
  }

  return (
    <div style={{ border: "1px solid #2a2336", borderRadius: 8, padding: 20, maxWidth: 480 }}>
      <h3 style={{ color: "#d4af37", fontSize: 16, marginBottom: 8 }}>Hero Video</h3>
      <p style={{ color: "#6b6478", fontSize: 12, marginBottom: 16 }}>
        Replaces the homepage background photo with a looping video. Leave empty to use the static photo.
      </p>

      {url && (
        <video src={url} muted loop autoPlay playsInline style={{ width: "100%", borderRadius: 6, marginBottom: 12, maxHeight: 200, objectFit: "cover" }} />
      )}

      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        style={{ fontSize: 12, color: "#c4b8e0" }}
      />
      {uploading && <p style={{ color: "#6b6478", fontSize: 12, marginTop: 8 }}>Uploading…</p>}
      {saved && !uploading && <p style={{ color: "#3aa898", fontSize: 12, marginTop: 8 }}>Saved.</p>}
      {error && <p style={{ color: "#d4756b", fontSize: 12, marginTop: 8 }}>{error}</p>}

      {url && (
        <button
          onClick={handleClear}
          style={{ marginTop: 12, background: "none", border: "1px solid #d4756b55", color: "#d4756b", borderRadius: 4, padding: "6px 12px", fontSize: 12, cursor: "pointer" }}
        >
          Remove video
        </button>
      )}
    </div>
  );
}
