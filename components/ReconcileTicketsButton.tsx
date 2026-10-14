"use client";

import { useState } from "react";
import { smallBtn, smallDangerBtn } from "./admin/form-styles";

export default function ReconcileTicketsButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [summary, setSummary] = useState("");

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/reconcile-tickets", { method: "POST" });
      const data = await res.json();
      setSummary(
        res.ok
          ? `Checked ${data.checked}, fulfilled ${data.fulfilled}`
          : data.error || "Failed"
      );
      setState("done");
      if (res.ok && data.fulfilled > 0) {
        setTimeout(() => window.location.reload(), 1500);
      }
    } catch {
      setSummary("Failed");
      setState("done");
    }
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "loading"}
        style={smallBtn}
      >
        {state === "loading" ? "Checking with Stripe…" : "Reconcile pending tickets"}
      </button>
      {state === "done" && <span style={{ color: "#c4b8e0", opacity: 0.7, fontSize: 12, textTransform: "none", letterSpacing: 0 }}>{summary}</span>}
    </span>
  );
}
