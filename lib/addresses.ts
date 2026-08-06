// Private addresses are never committed to this (public) repo — they're read
// from the RSVP_ADDRESSES env var in Vercel, set as JSON:
// {"event-id": "123 Main St, New Orleans, LA"}
// Shared by both the free-RSVP flow and the paid-ticket flow.
export function privateAddressForEvent(eventId: string): string | undefined {
  try {
    const map = JSON.parse(process.env.RSVP_ADDRESSES ?? "{}") as Record<string, string>;
    return map[eventId];
  } catch {
    return undefined;
  }
}
