"use client";

import { useState } from "react";

export default function ClearPendingButton({
  table, count,
}: { table: "merch" | "playlist" | "merch-build" | "tickets"; count: number }) {
  const [loading, setLoading] = useState(false);

  async function handleClear() {
    if (!confirm(`Remove all ${count} pending (unpaid) test orders in this section?`)) return;
    setLoading(true);
    const res = await fetch("/api/admin/orders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ table, clearPending: true }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to clear");
      setLoading(false);
    }
  }

  if (count === 0) return null;

  return (
    <button
      onClick={handleClear}
      disabled={loading}
      style={{
        background: "transparent",
        border: "1px solid #6355b866",
        color: "#a89ae0",
        padding: "4px 10px",
        fontSize: 11,
        cursor: "pointer",
        marginLeft: 12,
      }}
    >
      {loading ? "Clearing…" : `Clear ${count} pending`}
    </button>
  );
}
