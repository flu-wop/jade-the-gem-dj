"use client";

import { useState } from "react";

export default function DeleteOrderButton({
  table, id,
}: { table: "merch" | "playlist" | "merch-build" | "tickets"; id: number | string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Remove this order?")) return;
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, id }),
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
