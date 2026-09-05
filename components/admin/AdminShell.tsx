"use client"
// components/admin/AdminShell.tsx
// Persistent nav shell for /admin/* — sticky top bar with links to every
// admin section + logout. Matches the inline-style convention the admin
// pages already use (rest of the site uses Tailwind, admin doesn't).

import { usePathname } from "next/navigation"
import Link from "next/link"
import { LogoutButton } from "./LogoutButton"

const SECTIONS = [
  { href: "/admin",        label: "Admin" },
  { href: "/admin/system", label: "System Health" },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div style={{ minHeight: "100vh", background: "#0e0b14" }}>
      <div
        style={{
          position: "sticky", top: 0, zIndex: 20,
          borderBottom: "1px solid #2a2336",
          background: "rgba(14,11,20,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          style={{
            maxWidth: 960, margin: "0 auto", padding: "12px 32px",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
          }}
        >
          <nav style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {SECTIONS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontSize: 13,
                    letterSpacing: "0.04em",
                    padding: "6px 12px",
                    borderRadius: 4,
                    whiteSpace: "nowrap",
                    color: active ? "#d4af37" : "#c4b8e0",
                    background: active ? "#d4af3722" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
          <LogoutButton />
        </div>
      </div>
      {children}
    </div>
  )
}
