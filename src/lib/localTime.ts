/**
 * Formats the current wall-clock time in a given IANA timezone, e.g. "13:03".
 * Used by the contact footer's live clock. Pure and stateless — callers own the
 * interval that re-invokes it.
 */
export function formatLocalTime(timezone: string, date: Date = new Date()): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timezone,
    }).format(date);
  } catch {
    // Unknown zone (very old runtime) — fall back to local time.
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  }
}
