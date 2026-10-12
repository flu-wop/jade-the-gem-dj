// lib/insights/config.ts
// Jade the Gem DJ's InsightsConfig. Sales come from this site's own tables.
import type { ResultSet } from "@libsql/client"
import type { DayRange, DayValue, InsightsConfig } from "./types"
import { localDay, addDays } from "./core"

const TZ = "America/Chicago"

const since = (r: DayRange) => `${addDays(r.start, -1)} 00:00:00`
function rowsOf(res: ResultSet, map: (v: number) => number = (v) => v): DayValue[] {
  return res.rows.map((row) => ({
    date: localDay(new Date(String(row.ts).replace(" ", "T") + "Z"), TZ),
    value: map(Number(row.v) || 0),
  }))
}

export const insightsConfig: InsightsConfig = {
  siteName: "Jade the Gem DJ",
  eventsTable: "jade_site_events",
  timezone: TZ,
  eventTypes: ["page_view", "page_time", "checkout_click"],
  sources: [
    {
      key: "revenue", label: "Revenue", format: "money",
      fetch: async (r, db) => rowsOf(await db.execute({ sql: "SELECT ts, v FROM (SELECT created_at AS ts, amount_cents AS v FROM bookings WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, amount_cents AS v FROM merch_orders WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, amount_cents AS v FROM merch_build_orders WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, amount_cents AS v FROM event_tickets WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, amount_cents AS v FROM playlist_orders WHERE status IN ('paid','fulfilled')) WHERE ts >= ?", args: [since(r)] }), (v) => v / 100),
    },
    {
      key: "sales", label: "Bookings & orders", format: "count",
      fetch: async (r, db) => rowsOf(await db.execute({ sql: "SELECT ts, v FROM (SELECT created_at AS ts, 1 AS v FROM bookings WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, 1 AS v FROM merch_orders WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, 1 AS v FROM merch_build_orders WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, 1 AS v FROM event_tickets WHERE status IN ('paid','fulfilled') UNION ALL SELECT created_at AS ts, 1 AS v FROM playlist_orders WHERE status IN ('paid','fulfilled')) WHERE ts >= ?", args: [since(r)] })),
    },
  ],
  funnels: [
    {
      label: "Booking or buying",
      steps: [
        { label: "Visited the site", type: "page_view" },
        { label: "Opened Bookings", type: "page_view", path: "/bookings" },
        { label: "Started checkout", type: "checkout_click" },
      ],
    },
  ],
  attention: async (db) => {
    const r = await db.execute("SELECT COUNT(*) AS n FROM merch_orders WHERE status = 'fulfill_failed'")
    return [{ label: "merch orders that failed to send to Printify", value: Number(r.rows[0]?.n ?? 0), tone: "alert" as const }]
  },
}
