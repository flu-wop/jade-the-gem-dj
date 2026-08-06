"use client";

import { useState, useRef } from "react";

export default function DeleteOrderButton({
  table, id,
}: { table: "merch" | "playlist" | "merch-build" | "tickets"; id: number | string }) {
  const [state, setState] = useState<"idle" | "confirm" | "loading" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleClick() {
    if (state === "idle" || state === "error") {
      setState("confirm");
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setState("idle"), 4000);
      return;
    }
    if (state === "confirm") {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      doDelete();
    }
  }

  async function doDelete() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  const label =
    state === "loading" ? "…" : state === "confirm" ? "Confirm?" : state === "error" ? "Failed — retry" : "Remove";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      style={{
        background: state === "confirm" ? "#d4af37" : "transparent",
        border: "1px solid #d4af3766",
        color: state === "confirm" ? "#111" : "#d4af37",
        padding: "6px 12px",
        fontSize: 11,
        cursor: "pointer",
        minHeight: 32,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}
