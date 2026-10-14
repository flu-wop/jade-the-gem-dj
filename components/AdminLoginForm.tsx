"use client";

import { useState } from "react";
import { adminBtn } from "@/components/admin/admin-btn";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-surface border border-[#2a2336] p-4 sm:p-5">
      <label htmlFor="admin-password" className="text-[10px] tracking-[0.18em] uppercase text-mist/70">
        Password
      </label>
      <input
        id="admin-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoFocus
        autoComplete="current-password"
        className="bg-background border border-[#2a2336] text-cream px-3 h-11 text-sm focus:outline-none focus:border-gold"
      />
      <button type="submit" disabled={loading} className={`${adminBtn.primary} w-full`}>
        {loading ? "Checking…" : "Log in"}
      </button>
      {error && <p role="alert" className="text-sm text-[#e8637a]">{error}</p>}
    </form>
  );
}
