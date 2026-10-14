// components/admin/form-styles.ts
// Shared inline styles for the admin editors (Events, Releases, Settings), so
// inputs, labels, panels and buttons look the same everywhere and match the
// admin pages' square, uppercase-button look.
import type { CSSProperties } from "react"

export const inputStyle: CSSProperties = {
  width: "100%",
  background: "#0e0b14",
  border: "1px solid #2a2336",
  color: "#f0ebe8",
  padding: "10px 12px",
  fontSize: 14,
}

export const labelStyle: CSSProperties = {
  display: "block",
  color: "#c4b8e0",
  opacity: 0.7,
  fontSize: 10,
  textTransform: "uppercase",
  letterSpacing: "0.18em",
  marginBottom: 6,
}

export const panelStyle: CSSProperties = {
  border: "1px solid #2a2336",
  background: "#16121f",
  padding: 20,
}

export const rowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  border: "1px solid #2a2336",
  background: "#16121f",
  padding: "12px 16px",
}

const btnBase: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  fontSize: 11,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  cursor: "pointer",
}

export const primaryBtn: CSSProperties = { ...btnBase, height: 40, padding: "0 16px", background: "#d4af37", color: "#0e0b14", border: "none", fontWeight: 600 }
export const secondaryBtn: CSSProperties = { ...btnBase, height: 40, padding: "0 16px", background: "#16121f", color: "#c4b8e0", border: "1px solid #2a2336" }
export const smallBtn: CSSProperties = { ...btnBase, height: 32, padding: "0 12px", background: "transparent", color: "#c4b8e0", border: "1px solid #2a2336" }
export const smallDangerBtn: CSSProperties = { ...btnBase, height: 32, padding: "0 12px", background: "transparent", color: "#e8637a", border: "1px solid #e8637a55" }

export const eyebrowStyle: CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.2em",
  color: "#c4b8e0",
  opacity: 0.8,
}
