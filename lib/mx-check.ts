import { promises as dns } from "dns";

const TIMEOUT_MS = 3000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("dns-timeout")), ms)),
  ]);
}

/**
 * Returns false only when we're confident the domain can't receive mail
 * (no MX and no A/AAAA records, or it doesn't exist). Any DNS error we're
 * unsure about (timeout, resolver hiccup) fails OPEN — we'd rather let a
 * borderline case through than block a real guest over a flaky lookup.
 */
export async function domainCanReceiveMail(email: string): Promise<boolean> {
  const domain = email.split("@")[1]?.toLowerCase().trim();
  if (!domain) return false;

  try {
    const mx = await withTimeout(dns.resolveMx(domain), TIMEOUT_MS);
    if (mx && mx.length > 0) return true;
  } catch (err) {
    const code = (err as NodeJS.ErrnoException)?.code;
    if (code !== "ENOTFOUND" && code !== "ENODATA") {
      // Transient/unknown error — fail open.
      return true;
    }
    // No MX records — some domains still accept mail via A/AAAA fallback.
  }

  try {
    const a = await withTimeout(dns.resolve4(domain), TIMEOUT_MS);
    if (a && a.length > 0) return true;
  } catch {
    // fall through to AAAA
  }

  try {
    const aaaa = await withTimeout(dns.resolve6(domain), TIMEOUT_MS);
    if (aaaa && aaaa.length > 0) return true;
  } catch {
    // no v6 either
  }

  return false;
}
