"use client";

import { useState } from "react";

export default function ReconcileMerchButton() {
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [summary, setSummary] = useState("");
  const [details, setDetails] = useState<{ sessionId: string; result: string }[]>([]);

  async function handleClick() {
    setState("loading");
    try {
      const res = await fetch("/api/admin/reconcile-merch", { method: "POST" });
      const data = await res.json();
      setSummary(
        res.ok
          ? `Checked ${data.checked}, fulfilled ${data.fulfilled}`
          : data.error || "Failed"
      );
      setDetails(Array.isArray(data.results) ? data.results : []);
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
    <span style={{ marginLeft: 12, display: "inline-flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
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
        {state === "loading" ? "Retrying with Printify…" : "Reconcile failed fulfillment"}
      </button>
      {state === "done" && <span style={{ color: "#6b6478", fontSize: 12 }}>{summary}</span>}
      {state === "done" && details.length > 0 && (
        <div style={{ width: "100%", marginTop: 4, fontSize: 11, color: "#8a8098" }}>
          {details.map((d) => (
            <div key={d.sessionId}>
              {d.sessionId.slice(0, 20)}… — {d.result}
            </div>
          ))}
        </div>
      )}
    </span>
  );
}
