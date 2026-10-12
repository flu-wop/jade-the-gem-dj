"use client"
// components/admin/AdminShell.tsx
// Persistent nav shell for /admin/* — sticky top bar with a brand row and a
// section row (Home, Insights, Orders, ...) + logout. Same structure as the
// other sites' admin (Epoch Skin, MCS); only the colours are Jade's.

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { ADMIN_SECTIONS } from "./sections"
import { LogoutButton } from "./LogoutButton"


export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ minHeight: "100vh", background: "#0e0b14" }}>
      <header
        style={{
          position: "sticky", top: 0, zIndex: 20,
          borderBottom: "1px solid #2a2336",
          background: "rgba(14,11,20,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 1024, margin: "0 auto", padding: "0 clamp(16px, 5vw, 32px)", height: 56,
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
          }}
        >
          <Link href="/admin" style={{ display: "flex", alignItems: "baseline", gap: 8, textDecoration: "none", minWidth: 0 }}>
            <span style={{ color: "#d4af37", fontSize: 14 }} aria-hidden>✦</span>
            <span style={{ color: "#f0ebe8", fontSize: 18, whiteSpace: "nowrap" }}>Jade the Gem</span>
            <span style={{ color: "#6b6478", fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase" }}>Admin</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexShrink: 0 }}>
            <Link href="/" aria-label="View site" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "#c4b8e0", textDecoration: "none" }}>
              <ExternalLink size={14} />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav
          aria-label="Admin sections"
          style={{ maxWidth: 1024, margin: "0 auto", padding: "0 clamp(12px, 4vw, 28px) 8px", display: "flex", gap: 4, overflowX: "auto" }}
        >
          {ADMIN_SECTIONS.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, flexShrink: 0,
                  height: 36, padding: "0 12px", fontSize: 12, letterSpacing: "0.04em", whiteSpace: "nowrap",
                  borderRadius: 2, textDecoration: "none",
                  color: active ? "#d4af37" : "#c4b8e0",
                  background: active ? "#d4af3722" : "transparent",
                }}
              >
                <Icon size={14} strokeWidth={1.8} aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
      </header>
      {children}
    </div>
  )
}
