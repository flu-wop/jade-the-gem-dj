"use client";

import { useState, useRef } from "react";

export default function ClearPendingButton({
  table, count,
}: { table: "merch" | "playlist" | "merch-build" | "tickets"; count: number }) {
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
      doClear();
    }
  }

  async function doClear() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/orders", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, clearPending: true }),
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

  if (count === 0) return null;

  const label =
    state === "loading" ? "Clearing…"
    : state === "confirm" ? `Confirm clear ${count}?`
    : state === "error" ? "Failed — retry"
    : `Clear ${count} pending`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === "loading"}
      style={{
        background: state === "confirm" ? "#a89ae0" : "transparent",
        border: "1px solid #6355b866",
        color: state === "confirm" ? "#111" : "#a89ae0",
        padding: "6px 12px",
        fontSize: 11,
        cursor: "pointer",
        marginLeft: 12,
        minHeight: 32,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}
