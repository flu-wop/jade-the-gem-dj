"use client";

import { useState, useRef } from "react";
import { smallBtn, smallDangerBtn } from "./admin/form-styles";

export default function DeleteRsvpButton({ id }: { id: number | string }) {
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
      const res = await fetch("/api/admin/rsvp", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
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
