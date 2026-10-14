"use client"
// components/admin/AdminShell.tsx
// Persistent nav shell for /admin/* — sticky top bar with a brand row and a
// section row (Home, Insights, Orders, ...) + logout. Same structure and
// behaviour as Epoch Skin's admin (filled active tab, scrolls the active tab
// into view on phones, fade hint at the edge); only the colours are Jade's.

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { ADMIN_SECTIONS } from "./sections"
import { LogoutButton } from "./LogoutButton"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const navRef = useRef<HTMLElement>(null)

  // Keep the active tab visible when the row scrolls sideways on phones.
  useEffect(() => {
    const nav = navRef.current
    const el = nav?.querySelector<HTMLElement>('[aria-current="page"]')
    if (nav && el) nav.scrollLeft = el.offsetLeft - nav.clientWidth / 2 + el.clientWidth / 2
  }, [pathname])

  return (
    <div className="admin-root min-h-screen bg-background text-cream">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-[#2a2336]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          <Link href="/admin" className="flex items-baseline gap-2 min-w-0">
            <span className="text-gold text-sm" aria-hidden>✦</span>
            <span className="font-display text-xl tracking-wide text-cream whitespace-nowrap">Jade the Gem</span>
            <span className="text-[10px] tracking-[0.22em] uppercase text-mist/60">Admin</span>
          </Link>
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" aria-label="View site" className="inline-flex items-center gap-1.5 text-xs text-mist hover:text-gold transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View site</span>
            </Link>
            <LogoutButton />
          </div>
        </div>
        <div className="relative max-w-6xl mx-auto">
          <nav ref={navRef} aria-label="Admin sections" className="relative flex gap-1 overflow-x-auto no-scrollbar px-3 sm:px-5 pb-2">
            {ADMIN_SECTIONS.map(({ href, label, icon: Icon }) => {
              const active = href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex items-center gap-1.5 px-3 h-9 text-xs tracking-wide whitespace-nowrap shrink-0 transition-colors ${
                    active ? "bg-gold text-background font-semibold" : "text-mist hover:text-cream hover:bg-surface-2"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.8} aria-hidden />
                  {label}
                </Link>
              )
            })}
          </nav>
          <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-background to-transparent md:hidden" aria-hidden />
        </div>
      </header>
      {children}
    </div>
  )
}
