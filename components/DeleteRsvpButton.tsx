"use client";

import { useState } from "react";

export default function DeleteRsvpButton({ id }: { id: number | string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this RSVP?")) return;
    setLoading(true);
    const res = await fetch("/api/admin/rsvp", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      style={{
        background: "transparent",
        border: "1px solid #d4af3766",
        color: "#d4af37",
        padding: "2px 8px",
        fontSize: 11,
        cursor: "pointer",
      }}
    >
      {loading ? "…" : "Remove"}
    </button>
  );
}
