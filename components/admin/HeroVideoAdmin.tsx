"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import { panelStyle, smallDangerBtn } from "./form-styles";

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
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-") || "hero.mp4";
      const blob = await upload(`hero-video/${Date.now()}-${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
        contentType: file.type || "video/mp4",
        multipart: true, // video files are large enough to benefit from chunked upload
      });

      const saveRes = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero_video_url", value: blob.url }),
      });
      if (!saveRes.ok) throw new Error("Uploaded but failed to update the setting.");

      setUrl(blob.url);
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
    <div style={{ ...panelStyle, maxWidth: 520 }}>
      <h3 className="font-display text-xl tracking-wide text-cream mb-2">Hero Video</h3>
      <p style={{ color: "#c4b8e0", opacity: 0.7, fontSize: 13, marginBottom: 16 }}>
        Replaces the homepage background photo with a looping video. Leave empty to use the static photo.
      </p>

      {url && (
        <video src={url} muted loop autoPlay playsInline style={{ width: "100%", marginBottom: 12, maxHeight: 220, objectFit: "cover" }} />
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
          style={{ ...smallDangerBtn, marginTop: 12 }}
        >
          Remove video
        </button>
      )}
    </div>
  );
}
