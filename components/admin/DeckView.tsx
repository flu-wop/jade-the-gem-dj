"use client"
// components/admin/DeckView.tsx
// The "Deck" tab on /admin/insights: Jade's numbers laid out like a DJ setup.
//   • Two platters. The record spins; the ring of bars around it is the data,
//     one bar per day (or per few days on long ranges), clockwise from the top.
//       left  = Revenue, right = Visitors
//   • A mixer in the middle: LED meters compare this period to the last one
//     (white tick = last period) and a pitch fader shows revenue vs last period.
//   • Two waveform lanes (each with its own scale, never one shared axis) and a
//     shared playhead: hover or drag on any of them and everything lines up.
//   • Performance pads for the booking funnel, and a table view of the raw days.
// Colours are a fixed-order categorical set validated against the dark surface
// (revenue gold, sales violet, visitors teal, page views orange). Text stays in
// cream/mist; the colour only marks which series a thing is.

import { useMemo, useRef, useState } from "react"
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react"
import type { Insights } from "@/lib/insights/types"
import { money, num, delta } from "./insights-ui"

const C = { revenue: "#b8891c", sales: "#7c6cd6", visitors: "#2a9d8f", views: "#cc6238" }
const TRACK = "#2a2336"
const UNLIT = "#241d33"

type Bucket = { start: string; end: string; revenue: number; sales: number; visitors: number }

function bucketize(daily: Insights["daily"]): Bucket[] {
  const size = Math.max(1, Math.ceil(daily.length / 90))
  const out: Bucket[] = []
  for (let i = 0; i < daily.length; i += size) {
    const s = daily.slice(i, i + size)
    out.push({
      start: s[0].date,
      end: s[s.length - 1].date,
      revenue: s.reduce((a, d) => a + (d.series.revenue ?? 0), 0),
      sales: s.reduce((a, d) => a + (d.series.sales ?? 0), 0),
      visitors: s.reduce((a, d) => a + d.visitors, 0),
    })
  }
  return out
}

const shortDate = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })
const rangeLabel = (b: Bucket) => (b.start === b.end ? shortDate(b.start) : `${shortDate(b.start)} – ${shortDate(b.end)}`)
const compactMoney = (n: number) => (n >= 100000 ? `$${Math.round(n / 1000)}k` : n >= 10000 ? `$${(n / 1000).toFixed(1)}k` : `$${Math.round(n).toLocaleString("en-US")}`)
const compactNum = (n: number) => (n >= 100000 ? `${Math.round(n / 1000)}k` : n >= 10000 ? `${(n / 1000).toFixed(1)}k` : n.toLocaleString("en-US"))
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v))

// ── Platter ─────────────────────────────────────────────────────
const CX = 170
// Rounded so the server and the browser print identical numbers (no hydration mismatch).
const r2 = (n: number) => Math.round(n * 100) / 100
const pt = (r: number, deg: number): [number, number] => [r2(CX + r * Math.cos((deg * Math.PI) / 180)), r2(CX + r * Math.sin((deg * Math.PI) / 180))]
const wedge = (a: number, b: number) => {
  const [x1, y1] = pt(116, a)
  const [x2, y2] = pt(116, b)
  return `M${CX} ${CX} L${x1} ${y1} A116 116 0 0 1 ${x2} ${y2} Z`
}

function Platter({
  title, color, buckets, pick, total, compact, hi, setHi, daysPerBar, className,
}: {
  title: string; color: string; buckets: Bucket[]; pick: (b: Bucket) => number; total: number
  compact: (n: number) => string; hi: number | null; setHi: (i: number | null) => void
  daysPerBar: number; className: string
}) {
  const n = buckets.length
  const values = buckets.map(pick)
  const max = Math.max(0, ...values)
  const r1 = 126
  const slot = (2 * Math.PI * r1) / n
  const barW = r2(clamp(slot * 0.5, 1.2, 5))
  const active = hi !== null && buckets[hi] ? hi : null
  const shown = active !== null ? values[active] : total

  return (
    <div className={className}>
      <div className="relative aspect-square w-full max-w-[340px] mx-auto">
        {/* The record: only this layer spins (and only if motion is allowed). */}
        <svg viewBox="0 0 340 340" className="absolute inset-0 w-full h-full motion-safe:animate-[spin_20s_linear_infinite]" aria-hidden>
          <circle cx={CX} cy={CX} r={118} fill="#0b0910" stroke={TRACK} />
          {Array.from({ length: 15 }, (_, i) => 58 + i * 4).map((r) => (
            <circle key={r} cx={CX} cy={CX} r={r} fill="none" stroke="#f0ebe8" strokeOpacity={0.06} />
          ))}
          <path d={wedge(20, 42)} fill="#f0ebe8" fillOpacity={0.04} />
          <path d={wedge(200, 222)} fill="#f0ebe8" fillOpacity={0.04} />
          <circle cx={CX} cy={CX} r={48} fill={color} />
          <circle cx={CX} cy={CX} r={48} fill="none" stroke="#000" strokeOpacity={0.3} />
          <circle cx={CX} cy={CX - 38} r={2.5} fill="#0e0b14" fillOpacity={0.55} />
        </svg>

        {/* The data ring + label. Static, so it stays readable and hoverable. */}
        <svg
          viewBox="0 0 340 340"
          className="absolute inset-0 w-full h-full font-display touch-pan-y"
          role="img"
          aria-label={`${title}: ${compact(total)} in this period. A ring of bars shows each ${daysPerBar === 1 ? "day" : `${daysPerBar}-day stretch`}, clockwise from the top. A table with every day is below.`}
          onPointerLeave={() => setHi(null)}
        >
          <circle cx={CX} cy={CX} r={r1} fill="none" stroke={TRACK} />
          {values.map((v, i) => {
            const a = ((i + 0.5) / n) * 360 - 90
            const len = v > 0 && max > 0 ? 3 + (v / max) * 31 : 1.5
            const [x1, y1] = pt(r1, a)
            const [x2, y2] = pt(r1 + len, a)
            const [hx2, hy2] = pt(r1 + 40, a)
            const dim = active !== null && active !== i
            return (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={v > 0 ? color : "#3a3150"} strokeWidth={barW} opacity={dim ? 0.35 : 1} />
                <line
                  x1={x1} y1={y1} x2={hx2} y2={hy2} stroke="transparent" strokeWidth={r2(Math.max(slot, 6))}
                  onPointerEnter={() => setHi(i)} onPointerDown={() => setHi(i)}
                />
              </g>
            )
          })}
          <text x={CX} y={CX - 14} textAnchor="middle" fontSize={active !== null ? 10 : 11} letterSpacing={active !== null ? 0.5 : 2} fill="#0e0b14" fillOpacity={0.8}>
            {active !== null ? rangeLabel(buckets[active]) : title.toUpperCase()}
          </text>
          <text x={CX} y={CX + 16} textAnchor="middle" fontSize={active !== null ? 28 : 30} fill="#0e0b14">
            {compact(shown)}
          </text>
        </svg>
      </div>
      <p className="mt-2 text-center text-[11px] text-mist/60">
        Each bar is {daysPerBar === 1 ? "a day" : `${daysPerBar} days`}, clockwise from the top.
      </p>
    </div>
  )
}

// ── Mixer ───────────────────────────────────────────────────────
const SEG = 14

function Meter({ label, color, value, cur, prev }: { label: string; color: string; value: string; cur: number; prev: number }) {
  const ref = Math.max(cur, prev, 0)
  const litN = ref ? Math.round((cur / ref) * SEG) : 0
  const prevN = ref && prev ? Math.max(1, Math.round((prev / ref) * SEG)) : 0
  const d = delta(cur, prev)
  const Icon = d.dir === "up" ? ArrowUpRight : d.dir === "down" ? ArrowDownRight : Minus
  const tone = d.dir === "up" ? "text-emerald-400" : d.dir === "down" ? "text-red-400" : "text-mist/60"
  return (
    <div className="min-w-0 flex flex-col items-center">
      <div
        className="relative flex flex-col-reverse gap-[2px] w-3.5"
        role="img"
        aria-label={`${label}: ${value}. ${d.label}${d.dir === "up" || d.dir === "down" ? " compared with the last period" : ""}.`}
      >
        {Array.from({ length: SEG }, (_, i) => (
          <span key={i} className="block h-[6px] w-full" style={{ background: i < litN ? color : UNLIT }} />
        ))}
        {prevN > 0 && <span className="absolute -right-2 w-1.5 h-[2px] bg-cream/80" style={{ bottom: prevN * 8 - 5 }} aria-hidden />}
      </div>
      <p className="mt-2 text-[9px] tracking-[0.12em] uppercase text-mist/70 truncate max-w-full">{label}</p>
      <p className="font-display text-xl text-cream leading-none mt-1 max-w-full truncate">{value}</p>
      <span className={`mt-1 inline-flex items-center gap-0.5 text-[10px] font-medium ${tone}`}>
        {(d.dir === "up" || d.dir === "down" || d.dir === "flat") && <Icon className="w-2.5 h-2.5" strokeWidth={2} aria-hidden />}
        {d.dir === "none" ? "—" : d.dir === "new" ? "new" : d.label}
      </span>
    </div>
  )
}

function PitchFader({ cur, prev }: { cur: number; prev: number }) {
  const pct = prev > 0 && cur >= 0 ? Math.round(((cur - prev) / prev) * 100) : null
  const top = 50 - clamp(pct ?? 0, -50, 50)
  return (
    <div className="min-w-0 flex flex-col items-center">
      <div
        className="relative w-7"
        style={{ height: SEG * 8 - 2 }}
        role="img"
        aria-label={pct === null ? "Pitch: no revenue in the last period to compare with." : `Pitch: revenue ${pct > 0 ? "up" : pct < 0 ? "down" : "flat"} ${Math.abs(pct)} percent compared with the last period.`}
      >
        <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[3px]" style={{ background: TRACK }} />
        {[0, 25, 50, 75, 100].map((t) => (
          <span key={t} className="absolute left-0 right-0 h-px" style={{ top: `${t}%`, background: t === 50 ? "#c4b8e0" : TRACK, opacity: t === 50 ? 0.5 : 1 }} />
        ))}
        {pct !== null && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-7 h-3 bg-cream border border-black/40 flex items-center justify-center transition-[top] duration-500"
            style={{ top: `calc(${top}% - 6px)` }}
          >
            <span className="block w-4 h-[2px]" style={{ background: C.revenue }} />
          </div>
        )}
      </div>
      <p className="mt-2 text-[9px] tracking-[0.12em] uppercase text-mist/70">Pitch</p>
      <p className="font-display text-xl text-cream leading-none mt-1">{pct === null ? "—" : `${pct > 0 ? "+" : ""}${pct}%`}</p>
      <span className="mt-1 text-[10px] text-mist/60">revenue</span>
    </div>
  )
}

// ── Waveform lane ───────────────────────────────────────────────
function Lane({
  label, color, values, buckets, hi, setHi, total,
}: {
  label: string; color: string; values: number[]; buckets: Bucket[]; hi: number | null
  setHi: (i: number | null) => void; total: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const n = values.length
  const max = Math.max(0, ...values)
  const pick = (x: number) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    setHi(clamp(Math.floor(((x - r.left) / r.width) * n), 0, n - 1))
  }
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-1.5">
        <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-mist/80">
          <span className="w-2.5 h-2.5" style={{ background: color }} aria-hidden />
          {label}
        </span>
        <span className="text-xs text-mist/70 tabular-nums">{total}</span>
      </div>
      <div
        ref={ref}
        className="relative h-16 flex items-center gap-px touch-pan-y select-none bg-background/60 border border-[#2a2336] px-1"
        onPointerMove={(e) => pick(e.clientX)}
        onPointerDown={(e) => pick(e.clientX)}
        onPointerLeave={() => setHi(null)}
        role="img"
        aria-label={`${label} waveform, one bar per ${n === 0 ? "day" : "slice of the range"}.`}
      >
        <span className="absolute left-0 right-0 top-1/2 h-px" style={{ background: TRACK }} aria-hidden />
        {values.map((v, i) => (
          <span
            key={i}
            className="relative flex-1 min-w-px rounded-full"
            style={{
              height: `${v > 0 && max > 0 ? Math.max(10, (v / max) * 100) : 4}%`,
              background: v > 0 ? color : "#3a3150",
              opacity: hi === null || hi === i ? (v > 0 ? 1 : 0.6) : 0.35,
            }}
          />
        ))}
        {hi !== null && buckets[hi] && (
          <span
            className="pointer-events-none absolute top-0 bottom-0 w-px bg-cream/80"
            style={{ left: `calc(0.25rem + (100% - 0.5rem) * ${(hi + 0.5) / n})` }}
            aria-hidden
          />
        )}
      </div>
    </div>
  )
}

// ── Deck ────────────────────────────────────────────────────────
export function DeckView({ data }: { data: Insights }) {
  const [hi, setHi] = useState<number | null>(null)
  const buckets = useMemo(() => bucketize(data.daily), [data.daily])
  const rev = data.sources.find((s) => s.key === "revenue")
  const sales = data.sources.find((s) => s.key === "sales")
  const days = data.range.days
  const n = buckets.length
  const daysPerBar = Math.max(1, Math.round(data.daily.length / Math.max(1, n)))
  const hasAny = (rev?.total ?? 0) > 0 || (sales?.total ?? 0) > 0 || data.visitors.cur > 0
  const active = hi !== null && buckets[hi] ? buckets[hi] : null
  const funnel = data.funnels[0]
  const funnelTop = Math.max(1, funnel?.steps[0]?.value ?? 1)

  return (
    <div className="space-y-4">
      {!hasAny && (
        <p className="text-xs text-mist/70 bg-surface border border-[#2a2336] px-4 py-3 leading-relaxed">
          Nothing is spinning yet. Once there are paid bookings, orders or visitors in this range, they play here.
        </p>
      )}

      <div className="relative bg-surface bg-gem-glow border border-[#2a2336] p-4 sm:p-6">
        <div className="grid grid-cols-2 lg:grid-cols-[1fr_minmax(280px,0.9fr)_1fr] gap-x-4 gap-y-6 items-start">
          <Platter
            className="order-1" title="Revenue" color={C.revenue} buckets={buckets} pick={(b) => b.revenue}
            total={rev?.total ?? 0} compact={compactMoney} hi={hi} setHi={setHi} daysPerBar={daysPerBar}
          />

          <div className="order-3 col-span-2 lg:col-span-1 lg:order-2 bg-background/60 border border-[#2a2336] p-3 sm:p-4">
            <div className="bg-background border border-[#2a2336] px-3 py-2.5 mb-4" aria-live="polite">
              <p className="text-[10px] tracking-[0.18em] uppercase text-mist/60">{active ? "Playhead" : "Now playing"}</p>
              <p className="font-display text-xl text-cream leading-tight">
                {active ? rangeLabel(active) : `${shortDate(data.range.start)} – ${shortDate(data.range.end)}`}
              </p>
              <p className="text-xs text-mist/80 tabular-nums mt-0.5">
                {money(active ? active.revenue : rev?.total ?? 0)} · {num(active ? active.sales : sales?.total ?? 0)} sales · {num(active ? active.visitors : data.visitors.cur)} visitors
              </p>
            </div>
            <div className="grid grid-cols-5 gap-2">
              <Meter label="Revenue" color={C.revenue} value={compactMoney(rev?.total ?? 0)} cur={rev?.total ?? 0} prev={rev?.prev ?? 0} />
              <Meter label="Sales" color={C.sales} value={compactNum(sales?.total ?? 0)} cur={sales?.total ?? 0} prev={sales?.prev ?? 0} />
              <Meter label="Visitors" color={C.visitors} value={compactNum(data.visitors.cur)} cur={data.visitors.cur} prev={data.visitors.prev} />
              <Meter label="Views" color={C.views} value={compactNum(data.pageviews.cur)} cur={data.pageviews.cur} prev={data.pageviews.prev} />
              <PitchFader cur={rev?.total ?? 0} prev={rev?.prev ?? 0} />
            </div>
            <p className="mt-4 text-[10px] leading-relaxed text-mist/60">
              Meters show this period against the last one; the white tick marks where the last period landed. Pitch is revenue versus the last period.
            </p>
          </div>

          <Platter
            className="order-2 lg:order-3" title="Visitors" color={C.visitors} buckets={buckets} pick={(b) => b.visitors}
            total={data.visitors.cur} compact={compactNum} hi={hi} setHi={setHi} daysPerBar={daysPerBar}
          />
        </div>
      </div>

      <div className="bg-surface border border-[#2a2336] p-4 sm:p-6 space-y-4">
        <div>
          <h2 className="font-display text-xl sm:text-2xl tracking-wide text-cream leading-tight">Timeline</h2>
          <p className="text-xs text-mist/60 mt-1">Slide across either lane to line up revenue and visitors on the same day. Each lane has its own scale.</p>
        </div>
        <Lane label="Revenue" color={C.revenue} values={buckets.map((b) => b.revenue)} buckets={buckets} hi={hi} setHi={setHi} total={money(rev?.total ?? 0)} />
        <Lane label="Visitors" color={C.visitors} values={buckets.map((b) => b.visitors)} buckets={buckets} hi={hi} setHi={setHi} total={num(data.visitors.cur)} />
        <div className="flex justify-between text-[10px] text-mist/60">
          <span>{shortDate(data.range.start)}</span>
          <span>{days} days</span>
          <span>{shortDate(data.range.end)}</span>
        </div>
      </div>

      {funnel && (
        <div className="bg-surface border border-[#2a2336] p-4 sm:p-6">
          <h2 className="font-display text-xl sm:text-2xl tracking-wide text-cream leading-tight">{funnel.label}</h2>
          <p className="text-xs text-mist/60 mt-1 mb-4">Each pad is a step. The brighter the pad, the more people reached it.</p>
          <ol className="grid grid-cols-3 gap-2 sm:gap-3">
            {funnel.steps.map((s, i) => {
              const prev = i ? funnel.steps[i - 1].value : null
              const glow = s.value / funnelTop
              return (
                <li
                  key={s.label}
                  className="border p-3 sm:p-4 min-w-0"
                  style={{ borderColor: glow > 0 ? `${C.sales}aa` : TRACK, background: `rgba(124,108,214,${(0.1 + glow * 0.4).toFixed(2)})` }}
                >
                  <p className="text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-mist/80 leading-snug">{s.label}</p>
                  <p className="font-display text-3xl sm:text-4xl text-cream leading-none mt-2">{compactNum(s.value)}</p>
                  <p className="text-[10px] text-mist/70 mt-1.5">{prev === null ? "everyone" : prev ? `${Math.round((s.value / prev) * 100)}% of the step before` : "—"}</p>
                </li>
              )
            })}
          </ol>
        </div>
      )}

      <details className="bg-surface border border-[#2a2336]">
        <summary className="cursor-pointer px-4 sm:px-6 py-3.5 text-[11px] tracking-[0.2em] uppercase text-mist/80 hover:text-cream">View as table</summary>
        <div className="max-h-72 overflow-auto px-4 sm:px-6 pb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] tracking-[0.18em] uppercase text-mist/60">
                <th className="py-2 pr-3 font-normal">Day</th>
                <th className="py-2 pr-3 font-normal text-right">Revenue</th>
                <th className="py-2 pr-3 font-normal text-right">Sales</th>
                <th className="py-2 font-normal text-right">Visitors</th>
              </tr>
            </thead>
            <tbody>
              {data.daily.map((d) => (
                <tr key={d.date} className="border-t border-[#2a2336]/70 tabular-nums">
                  <td className="py-1.5 pr-3 text-cream">{shortDate(d.date)}</td>
                  <td className="py-1.5 pr-3 text-right text-mist/80">{money(d.series.revenue ?? 0)}</td>
                  <td className="py-1.5 pr-3 text-right text-mist/80">{num(d.series.sales ?? 0)}</td>
                  <td className="py-1.5 text-right text-mist/80">{num(d.visitors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  )
}
