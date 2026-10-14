// components/admin/insights-ui.tsx
// Server-rendered pieces for /admin/insights: stat tiles, daily bars, tables,
// funnel. No client JS; charts are plain SVG/CSS. Cards and stat tiles follow
// Epoch Skin's insights UI (square panels, small-caps labels, arrow deltas).
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { Insights } from "@/lib/insights/types"

export const money = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 })}`
export const num = (n: number) => n.toLocaleString("en-US")

export function longDate(d: string) {
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
}

export function Card({ title, hint, children, className = "" }: { title: string; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-surface border border-[#2a2336] p-4 sm:p-6 min-w-0 ${className}`}>
      <div className="mb-4">
        <h2 className="font-display text-xl sm:text-2xl tracking-wide text-cream leading-tight">{title}</h2>
        {hint && <p className="text-xs text-mist/60 mt-1 leading-relaxed">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-mist/60 py-6 text-center leading-relaxed">{children}</p>
}

export function delta(cur: number, prev: number): { dir: "up" | "down" | "flat" | "new" | "none"; label: string } {
  if (!prev && !cur) return { dir: "none", label: "no data yet" }
  if (!prev) return { dir: "new", label: "new this period" }
  const pct = Math.round(((cur - prev) / prev) * 100)
  return { dir: pct > 0 ? "up" : pct < 0 ? "down" : "flat", label: `${pct > 0 ? "+" : ""}${pct}%` }
}

export function Stat({ label, value, cur, prev, sub }: { label: string; value: string; cur: number; prev: number; sub?: string }) {
  const d = delta(cur, prev)
  const Icon = d.dir === "up" ? ArrowUpRight : d.dir === "down" ? ArrowDownRight : Minus
  const tone = d.dir === "up" ? "text-emerald-400" : d.dir === "down" ? "text-red-400" : "text-mist/60"
  return (
    <div className="bg-surface border border-[#2a2336] p-4 sm:p-5 min-w-0">
      <p className="text-[10px] tracking-[0.18em] uppercase text-mist/70 mb-2 truncate">{label}</p>
      <p className="font-display text-3xl sm:text-4xl text-cream leading-none truncate">{value}</p>
      <div className="mt-2.5 flex items-center gap-2 text-[11px] min-h-[16px] flex-wrap">
        <span className={`inline-flex items-center gap-0.5 font-medium ${tone}`}>
          {(d.dir === "up" || d.dir === "down" || d.dir === "flat") && <Icon className="w-3 h-3" strokeWidth={2} aria-hidden />}
          {d.label}
        </span>
        <span className="text-mist/60 truncate">{sub ?? (d.dir === "none" || d.dir === "new" ? "" : "vs previous period")}</span>
      </div>
    </div>
  )
}

export function Bars({ rows, format }: { rows: { date: string; value: number }[]; format: (n: number) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <div>
      <div className="flex items-end gap-px h-28" role="img" aria-label="Daily values">
        {rows.map((r) => (
          <div
            key={r.date}
            title={`${longDate(r.date)}: ${format(r.value)}`}
            className="flex-1 bg-gold/70 hover:bg-gold min-w-[2px]"
            style={{ height: `${Math.max(2, (r.value / max) * 100)}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-mist/60 mt-1.5">
        <span>{longDate(rows[0].date)}</span>
        <span>{longDate(rows[rows.length - 1].date)}</span>
      </div>
    </div>
  )
}

function Row({ left, right, mono }: { left: string; right: string; mono?: boolean }) {
  return (
    <div className="flex justify-between gap-3 text-sm py-2 border-b border-[#2a2336]/70 last:border-0">
      <span className={`text-cream truncate ${mono ? "font-mono text-xs" : ""}`}>{left}</span>
      <span className="text-mist/80 shrink-0 tabular-nums">{right}</span>
    </div>
  )
}

export function Overview({ data }: { data: Insights }) {
  return (
    <div className="space-y-4">
      {data.attention.length > 0 && (
        <div className="grid sm:grid-cols-3 gap-3">
          {data.attention.map((a) => (
            <div key={a.label} className={`border px-4 py-3 text-sm ${a.tone === "alert" && a.value > 0 ? "border-red-400/40 bg-red-400/5 text-red-300" : "border-[#2a2336] bg-surface text-mist/70"}`}>
              <b className="text-cream">{num(a.value)}</b> {a.label}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {data.sources.map((s) => (
          <Stat key={s.key} label={s.label} value={s.format === "money" ? money(s.total) : num(s.total)} cur={s.total} prev={s.prev} />
        ))}
        <Stat label="Visitors" value={num(data.visitors.cur)} cur={data.visitors.cur} prev={data.visitors.prev} />
        <Stat label="Page views" value={num(data.pageviews.cur)} cur={data.pageviews.cur} prev={data.pageviews.prev} />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {data.sources.filter((s) => s.format === "money").map((s) => (
          <Card key={s.key} title={`${s.label} by day`}>
            <Bars rows={data.daily.map((d) => ({ date: d.date, value: d.series[s.key] ?? 0 }))} format={money} />
          </Card>
        ))}
        <Card title="Visitors by day">
          <Bars rows={data.daily.map((d) => ({ date: d.date, value: d.visitors }))} format={num} />
        </Card>
      </div>
    </div>
  )
}

export function PagesTab({ data }: { data: Insights }) {
  const devTotal = Object.values(data.devices).reduce((a, b) => a + b, 0)
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card title="Top pages">
        {data.pages.length === 0 && <Empty>No page views recorded in this range.</Empty>}
        {data.pages.map((p) => (
          <Row key={p.path} left={p.path || "/"} right={`${num(p.views)} views${p.avgTime ? ` · ${p.avgTime}s avg` : ""}`} mono />
        ))}
      </Card>
      <div className="space-y-4">
        <Card title="Where visitors came from">
          {data.referrers.length === 0 && <Empty>No outside referrers yet (direct visits don&apos;t show here).</Empty>}
          {data.referrers.map((r) => <Row key={r.host} left={r.host} right={num(r.visits)} />)}
        </Card>
        <Card title="Devices">
          {devTotal === 0 && <Empty>No visits recorded in this range.</Empty>}
          {Object.entries(data.devices).map(([k, v]) => (
            <Row key={k} left={k.charAt(0).toUpperCase() + k.slice(1)} right={`${Math.round((v / devTotal) * 100)}% (${num(v)})`} />
          ))}
        </Card>
      </div>
    </div>
  )
}

export function FunnelTab({ data }: { data: Insights }) {
  const sales = data.sources.find((s) => s.key === "sales")
  return (
    <div className="space-y-4">
      {data.funnels.map((f) => {
        const top = Math.max(1, f.steps[0]?.value ?? 1)
        return (
          <Card key={f.label} title={f.label}>
            <ol className="space-y-3">
              {f.steps.map((s, i) => (
                <li key={s.label}>
                  <div className="flex justify-between gap-3 text-sm mb-1.5">
                    <span className="text-cream min-w-0 truncate">{s.label}</span>
                    <span className="text-mist/80 shrink-0 tabular-nums">
                      {num(s.value)}
                      {i > 0 && f.steps[i - 1].value ? <span className="text-xs ml-1.5 text-mist/60">{Math.round((s.value / f.steps[i - 1].value) * 100)}% of previous</span> : null}
                    </span>
                  </div>
                  <div className="h-2 bg-[#2a2336]/70"><div className="h-2 bg-gold" style={{ width: `${(s.value / top) * 100}%`, minWidth: s.value ? 4 : 0 }} /></div>
                </li>
              ))}
            </ol>
            {sales && <p className="text-xs text-mist/60 mt-5">Completed purchases in this range: <b className="text-cream">{num(sales.total)}</b> (from Stripe, counted separately from visitor tracking).</p>}
          </Card>
        )
      })}
    </div>
  )
}
