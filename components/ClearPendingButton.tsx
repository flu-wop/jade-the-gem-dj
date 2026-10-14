"use client";

import { useState, useRef } from "react";
import { smallBtn, smallDangerBtn } from "./admin/form-styles";

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
        ...smallDangerBtn,
        background: state === "confirm" ? "#e8637a" : "transparent",
        color: state === "confirm" ? "#0e0b14" : "#e8637a",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {label}
    </button>
  );
}
