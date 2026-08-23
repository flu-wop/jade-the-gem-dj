import { db, getDb, initDb } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getResend } from "@/lib/resend";
import { upcomingEvents } from "@/lib/data";

export type CheckResult = { status: "ok" | "warn" | "error"; detail: string };

// ---- 1. Env Var Status ----
const REQUIRED_ENV_VARS = [
  "TURSO_DATABASE_URL",
  "TURSO_AUTH_TOKEN",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "RESEND_TO_EMAIL",
  "ADMIN_PASSWORD",
  "NEXT_PUBLIC_SITE_URL",
  "RSVP_ADDRESSES",
  "PRINTIFY_API_TOKEN",
  "PRINTIFY_SHOP_ID",
];

export function checkEnvVars(): Record<string, CheckResult> {
  const results: Record<string, CheckResult> = {};
  for (const key of REQUIRED_ENV_VARS) {
    const present = !!process.env[key];
    results[key] = { status: present ? "ok" : "error", detail: present ? "set" : "MISSING" };
  }
  return results;
}

// ---- 2. Webhook Health ----
export async function checkStripe(): Promise<CheckResult> {
  try {
    const endpoints = await stripe.webhookEndpoints.list({ limit: 10 });
    const site = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/^https?:\/\//, "");
    const match = endpoints.data.find((e) => e.url.includes(site));
    if (!match) return { status: "warn", detail: "No webhook endpoint found for this site's URL" };
    if (match.status !== "enabled") return { status: "error", detail: `Endpoint status: ${match.status}` };
    return { status: "ok", detail: `Enabled — ${match.url}` };
  } catch (err) {
    return { status: "error", detail: `Stripe API error: ${(err as Error).message}` };
  }
}

// Catches the exact failure mode from the Aug 2026 redirect incident: checkout
// rows stuck in 'pending' because the webhook never reached the server. A
// healthy site clears 'pending' within seconds of payment, so anything still
// pending after 15 minutes almost certainly means the webhook isn't firing.
export async function checkStalePendingOrders(): Promise<CheckResult> {
  try {
    const database = getDb();
    const tables = ["merch_orders", "playlist_orders", "merch_build_orders", "event_tickets"];
    const stale: string[] = [];
    for (const t of tables) {
      const r = await database.execute(
        `SELECT COUNT(*) as c FROM ${t} WHERE status = 'pending' AND created_at < datetime('now', '-15 minutes')`
      );
      const c = Number(r.rows[0]?.c ?? 0);
      if (c > 0) stale.push(`${t}: ${c}`);
    }
    if (stale.length === 0) return { status: "ok", detail: "No stuck pending orders" };
    return { status: "error", detail: `Stuck pending — webhook may be down: ${stale.join(", ")}` };
  } catch (err) {
    return { status: "error", detail: `Check failed: ${(err as Error).message}` };
  }
}

export async function checkResend(): Promise<CheckResult> {
  try {
    const domains = await getResend().domains.list();
    const fromDomain = (process.env.RESEND_FROM_EMAIL || "").split("@")[1];
    // TEMP DIAGNOSTIC — remove once the domain-not-found cause is confirmed.
    console.log(
      "checkResend DIAG:",
      JSON.stringify({
        fromEnv: process.env.RESEND_FROM_EMAIL,
        fromDomain,
        error: domains.error,
        domainsReturned: domains.data?.data?.map((d) => ({ name: d.name, status: d.status })),
      })
    );
    if (!fromDomain || fromDomain === "resend.dev") {
      return { status: "warn", detail: "Using resend.dev fallback — real domain not verified" };
    }
    // The SDK does NOT throw on API errors — it returns { data: null, error }.
    // A restricted/sending-only API key can send mail fine but gets rejected
    // here, which previously looked identical to "domain doesn't exist".
    if (domains.error) {
      return { status: "error", detail: `Resend API error: ${domains.error.message}` };
    }
    const match = domains.data?.data?.find((d) => d.name === fromDomain);
    if (!match) return { status: "error", detail: `Domain ${fromDomain} not found in Resend account` };
    if (match.status !== "verified") return { status: "error", detail: `Domain status: ${match.status}` };
    return { status: "ok", detail: `${fromDomain} verified` };
  } catch (err) {
    return { status: "error", detail: `Resend API error: ${(err as Error).message}` };
  }
}

export async function checkTurso(): Promise<CheckResult> {
  try {
    await initDb();
    await db.execute("SELECT 1");
    return { status: "ok", detail: "Connected" };
  } catch (err) {
    return { status: "error", detail: `Turso connection failed: ${(err as Error).message}` };
  }
}

// ---- 2b. Private addresses (RSVP_ADDRESSES) ----
// Confirms the JSON parses and has an entry for every event that needs one —
// never logs or returns the address itself, just whether it's configured.
export function checkPrivateAddresses(): CheckResult {
  const eventsNeedingAddress = upcomingEvents.filter((e) => e.rsvpRequired || e.ticketPrice);
  if (eventsNeedingAddress.length === 0) {
    return { status: "ok", detail: "No current events require a private address" };
  }

  let map: Record<string, string>;
  try {
    map = JSON.parse(process.env.RSVP_ADDRESSES ?? "{}");
  } catch {
    return { status: "error", detail: "RSVP_ADDRESSES is not valid JSON" };
  }

  const missing = eventsNeedingAddress.filter((e) => !map[e.id]?.trim()).map((e) => e.id);
  if (missing.length > 0) {
    return { status: "error", detail: `Missing address for: ${missing.join(", ")}` };
  }
  return { status: "ok", detail: `Configured for: ${eventsNeedingAddress.map((e) => e.id).join(", ")}` };
}

// ---- 3. API Usage (self-tracked — Resend/Stripe don't expose live quota via API) ----
export async function checkApiUsage(): Promise<CheckResult> {
  try {
    const database = getDb();
    const [merch, playlist, merchBuild, tickets, rsvps] = await Promise.all([
      database.execute("SELECT COUNT(*) as c FROM merch_orders WHERE created_at > datetime('now','-30 days')"),
      database.execute("SELECT COUNT(*) as c FROM playlist_orders WHERE created_at > datetime('now','-30 days')"),
      database.execute("SELECT COUNT(*) as c FROM merch_build_orders WHERE created_at > datetime('now','-30 days')"),
      database.execute("SELECT COUNT(*) as c FROM event_tickets WHERE created_at > datetime('now','-30 days')"),
      database.execute("SELECT COUNT(*) as c FROM rsvps WHERE created_at > datetime('now','-30 days')"),
    ]);
    const emailsApprox =
      Number(merch.rows[0]?.c ?? 0) * 2 +
      Number(playlist.rows[0]?.c ?? 0) * 2 +
      Number(merchBuild.rows[0]?.c ?? 0) * 2 +
      Number(tickets.rows[0]?.c ?? 0) * 2 +
      Number(rsvps.rows[0]?.c ?? 0) * 2;
    return {
      status: "ok",
      detail: `~${emailsApprox} transactional emails sent in last 30 days (2 per order/RSVP: guest + notification)`,
    };
  } catch (err) {
    return { status: "warn", detail: `Usage check failed: ${(err as Error).message}` };
  }
}
