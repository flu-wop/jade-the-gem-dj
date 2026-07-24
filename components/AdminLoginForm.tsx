"use client";

import { useState } from "react";

export default function AdminLoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Incorrect password");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 320, marginTop: 20 }}
    >
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Admin password"
        autoFocus
        style={{
          background: "#1a1626",
          border: "1px solid #4a3f8f55",
          color: "#f0ebe8",
          padding: "10px 12px",
          fontSize: 14,
        }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: "#d4af37",
          color: "#0e0b14",
          border: "none",
          padding: "10px 12px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        {loading ? "Checking…" : "Log in"}
      </button>
      {error && <p style={{ color: "#e07a7a", fontSize: 13, margin: 0 }}>{error}</p>}
    </form>
  );
}
