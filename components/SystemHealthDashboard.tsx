"use client";

import { useState, useEffect, useCallback } from "react";

type CheckResult = { status: "ok" | "warn" | "error"; detail: string };
type HealthData = {
  envVars: Record<string, CheckResult>;
  webhookHealth: { stripe: CheckResult; stalePending: CheckResult; resend: CheckResult; turso: CheckResult };
  apiUsage: CheckResult;
  checkedAt: string;
};

const STATUS_COLOR = { ok: "#3aa898", warn: "#d4af37", error: "#e8637a" };

function Pill({ status }: { status: "ok" | "warn" | "error" }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: STATUS_COLOR[status],
        marginRight: 10,
        flexShrink: 0,
      }}
    />
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#16111f",
        border: "1px solid #2a2336",
        borderRadius: 4,
        padding: 20,
      }}
    >
      <h3 style={{ color: "#3aa898", fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 14 }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export default function SystemHealthDashboard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState("");

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/health/");
      if (!res.ok) { setError("Failed to load health checks"); return; }
      setData(await res.json());
      setError("");
    } catch {
      setError("Failed to load health checks");
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 60_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  if (error) return <p style={{ color: "#e8637a" }}>{error}</p>;
  if (!data) return <p style={{ color: "#c4b8e0" }}>Checking system health…</p>;

  return (
    <div>
      <p style={{ color: "#c4b8e0", fontSize: 12, marginBottom: 20 }}>
        Last checked {new Date(data.checkedAt).toLocaleTimeString()} — refreshes every 60s
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        <Card title="Env Vars">
          {Object.entries(data.envVars).map(([key, r]) => (
            <div key={key} style={{ display: "flex", alignItems: "flex-start", marginBottom: 6, fontSize: 13 }}>
              <Pill status={r.status} />
              <span style={{ color: "#f0ebe8" }}>{key}</span>
              <span style={{ color: "#6b6478", marginLeft: 6 }}>— {r.detail}</span>
            </div>
          ))}
        </Card>

        <Card title="Webhook Health">
          {Object.entries(data.webhookHealth).map(([key, r]) => (
            <div key={key} style={{ display: "flex", alignItems: "flex-start", marginBottom: 8, fontSize: 13 }}>
              <Pill status={r.status} />
              <span>
                <span style={{ color: "#f0ebe8", textTransform: "capitalize" }}>
                  {key === "stalePending" ? "Stuck Orders" : key}
                </span>
                <br />
                <span style={{ color: "#6b6478" }}>{r.detail}</span>
              </span>
            </div>
          ))}
        </Card>

        <Card title="API Usage">
          <div style={{ display: "flex", alignItems: "flex-start", fontSize: 13 }}>
            <Pill status={data.apiUsage.status} />
            <span style={{ color: "#f0ebe8" }}>{data.apiUsage.detail}</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
