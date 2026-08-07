"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({
  title, badge, defaultOpen = false, children,
}: {
  title: string;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section style={{ marginTop: 16, border: "1px solid #2a2336", borderRadius: 4, overflow: "hidden" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          padding: "16px 18px",
          background: "#16111f",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ color: "#3aa898", fontSize: 15, letterSpacing: "0.04em" }}>{title}</span>
          {badge}
        </span>
        <ChevronDown
          size={18}
          color="#6b6478"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s", flexShrink: 0 }}
        />
      </button>
      {open && <div style={{ padding: "0 18px 18px" }}>{children}</div>}
    </section>
  );
}
