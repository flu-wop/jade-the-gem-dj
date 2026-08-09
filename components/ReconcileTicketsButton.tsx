"use client";

import { useState } from "react";

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
    <span style={{ marginLeft: 12, display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={state === "loading"}
        style={{
          background: "transparent",
          border: "1px solid #3aa89866",
          color: "#3aa898",
          padding: "6px 12px",
          fontSize: 11,
          cursor: "pointer",
          minHeight: 32,
        }}
      >
        {state === "loading" ? "Checking with Stripe…" : "Reconcile pending tickets"}
      </button>
      {state === "done" && <span style={{ color: "#6b6478", fontSize: 12 }}>{summary}</span>}
    </span>
  );
}
