// app/admin/page.tsx
// Admin home — a quick read on the last 30 days, what's coming up, and
// shortcuts to every section. Same layout as the other sites' admin home
// (Epoch Skin, MCS); the bookings/orders tables live at /admin/orders.
import Link from "next/link"
import { ArrowRight, Plus } from "lucide-react"
import { isAuthed } from "@/lib/admin-auth"
import { db, initDb } from "@/lib/db"
import { getDB } from "@/lib/insights/db"
import { getInsights } from "@/lib/insights/core"
import { insightsConfig } from "@/lib/insights/config"
import type { Insights } from "@/lib/insights/types"
import { AdminLogin } from "@/components/admin/page-frame"
import { ADMIN_SECTIONS } from "@/components/admin/sections"
import { AdminPage, adminBtn } from "@/components/admin/page-frame"
import { Stat, money, longDate } from "@/components/admin/insights-ui"

export const dynamic = "force-dynamic"
export const metadata = { title: "Admin", robots: { index: false } }

const DESCRIPTIONS: Record<string, string> = {
  "/admin/insights": "Sales, visitors & the booking funnel",
  "/admin/orders": "Bookings, tickets, RSVPs & merch",
  "/admin/events": "Add and edit events",
  "/admin/tracks": "Mixes & releases",
  "/admin/settings": "Hero video & site content",
  "/admin/system": "Env vars, webhooks & integrations",
}

type Upcoming = { key: string; date: string; time: string; title: string; sub: string; kind: "Booking" | "Event" }

const TZ = "America/Chicago"

function greeting() {
  const h = Number(new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: TZ }).format(new Date()))
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
}

function time12(t: string) {
  const m = /^(\d{1,2}):(\d{2})/.exec(t || "")
  if (!m) return t || ""
  const h = Number(m[1])
  return `${h % 12 || 12}:${m[2]} ${h < 12 ? "AM" : "PM"}`
}

export default async function AdminHomePage() {
  if (!(await isAuthed())) return <AdminLogin />

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date())

  // Make sure every table exists before Insights queries them (a no-op once created).
  try { await initDb() } catch (err) { console.error("[admin home] initDb", err) }

  let data: Insights | null = null
  let failed = false
  const idb = getDB()
  if (idb) {
    try { data = await getInsights(idb, insightsConfig, 30) } catch (err) { console.error("[admin home]", err); failed = true }
  }

  let upcoming: Upcoming[] = []
  try {
    const [b, e] = await Promise.all([
      db.execute({ sql: "SELECT id, name, event_date, event_type, hours, location FROM bookings WHERE status IN ('paid','fulfilled') AND event_date >= ? ORDER BY event_date ASC LIMIT 6", args: [today] }),
      db.execute({ sql: "SELECT id, title, date, time, venue, city FROM events WHERE date >= ? ORDER BY date ASC LIMIT 6", args: [today] }),
    ])
    upcoming = [
      ...b.rows.map((r): Upcoming => ({
        key: `b${r.id}`, date: String(r.event_date), time: "", kind: "Booking",
        title: String(r.name), sub: `${r.event_type} · ${r.hours} hr · ${r.location}`,
      })),
      ...e.rows.map((r): Upcoming => ({
        key: `e${r.id}`, date: String(r.date), time: String(r.time || ""), kind: "Event",
        title: String(r.title), sub: `${r.venue}, ${r.city}`,
      })),
    ].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0)).slice(0, 6)
  } catch (err) {
    console.error("[admin home] upcoming", err)
  }

  const rev = data?.sources.find((s) => s.key === "revenue")
  const sales = data?.sources.find((s) => s.key === "sales")
  const needsAttention = data?.attention.filter((a) => a.value > 0) ?? []

  return (
    <AdminPage>
      <div className="mb-6 sm:mb-8">
        <p className="text-[10px] tracking-[0.26em] uppercase text-gold mb-1.5">{longDate(today)}</p>
        <h1 className="font-display text-3xl sm:text-4xl text-cream leading-tight">{greeting()}, Jade</h1>
      </div>

      {needsAttention.map((a) => (
        <p key={a.label} className="mb-4 text-sm text-red-300 border border-red-400/30 bg-red-400/5 px-4 py-3">
          {a.value} {a.label}. <Link href="/admin/orders" className="underline">Review</Link>
        </p>
      ))}

      <section aria-label="Last 30 days" className="mb-8">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-mist">Last 30 days</h2>
          <Link href="/admin/insights" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
            All insights <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {data && rev && sales ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Stat label="Revenue" value={money(rev.total)} cur={rev.total} prev={rev.prev} />
            <Stat label="Bookings & orders" value={String(sales.total)} cur={sales.total} prev={sales.prev} />
            <Stat label="Visitors" value={data.visitors.cur.toLocaleString("en-US")} cur={data.visitors.cur} prev={data.visitors.prev} />
            <Stat label="Page views" value={data.pageviews.cur.toLocaleString("en-US")} cur={data.pageviews.cur} prev={data.pageviews.prev} />
          </div>
        ) : (
          <p className="text-sm text-mist bg-surface border border-[#2a2336] p-4">
            {failed || idb ? "Couldn’t load numbers right now. Sections below still work." : "Numbers need a database connection. Sections below still work."}
          </p>
        )}
      </section>

      <div className="grid gap-8 lg:gap-6 lg:grid-cols-[1.1fr_1fr]">
        <section aria-label="Coming up">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[11px] tracking-[0.2em] uppercase text-mist">Coming up</h2>
            <Link href="/admin/events" className="text-xs text-gold hover:underline inline-flex items-center gap-1">
              <Plus className="w-3 h-3" /> Add event
            </Link>
          </div>
          <div className="bg-surface border border-[#2a2336]">
            {upcoming.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-display text-lg text-cream mb-1">Nothing coming up yet</p>
                <p className="text-sm text-mist">Paid bookings and upcoming events will show up here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-[#2a2336]">
                {upcoming.map((u) => (
                  <li key={u.key} className="flex gap-4 px-4 sm:px-5 py-3.5">
                    <div className="w-16 shrink-0">
                      <p className={`text-[10px] tracking-[0.14em] uppercase ${u.date === today ? "text-gold font-medium" : "text-mist"}`}>
                        {u.date === today ? "Today" : longDate(u.date).split(",")[0]}
                      </p>
                      <p className="text-sm text-cream tabular-nums whitespace-nowrap">{u.time ? time12(u.time) : u.kind}</p>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-cream font-medium truncate">{u.title}</p>
                      <p className="text-xs text-mist truncate">{u.sub}</p>
                      <p className="text-[11px] text-mist/60 truncate">{longDate(u.date)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <Link href="/admin/orders" className="flex items-center justify-between px-4 sm:px-5 py-3 border-t border-[#2a2336] text-xs text-mist hover:text-cream">
              All bookings & orders <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        <section aria-label="Sections">
          <h2 className="text-[11px] tracking-[0.2em] uppercase text-mist mb-3">Go to</h2>
          <div className="grid grid-cols-2 gap-3">
            {ADMIN_SECTIONS.filter((s) => s.href !== "/admin").map(({ href, label, icon: Icon }) => {
              const hero = href === "/admin/insights"
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group border p-4 transition-colors min-w-0 hover:border-gold ${hero ? "col-span-2 bg-[#2a2336] border-[#2a2336]" : "bg-surface border-[#2a2336]"}`}
                >
                  <Icon className="w-4 h-4 mb-3 text-gold" strokeWidth={1.6} aria-hidden />
                  <p className="font-display text-lg leading-tight text-cream">{label}</p>
                  <p className="text-xs mt-1 leading-snug text-mist">{DESCRIPTIONS[href]}</p>
                </Link>
              )
            })}
          </div>
          <Link href="/bookings" className={`${adminBtn.secondary} w-full mt-3`}>
            Open the booking page
          </Link>
        </section>
      </div>
    </AdminPage>
  )
}
