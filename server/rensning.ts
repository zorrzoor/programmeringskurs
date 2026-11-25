// Periodic reset of the public instance (#165): every RESET_EVERY_MONTHS months (3 = each quarter) all names and progress
// are removed, on the 1st of the month in Swedish time. The months are counted from January: 3 gives 1 Jan, 1 Apr, 1 Jul
// and 1 Oct. Only divisors of 12 are allowed, so that every year has the same reset days.

import type { Store } from "./db.ts";

export const RESET_TIME_ZONE = "Europe/Stockholm";
export const ALLOWED_RESET_MONTHS = [1, 2, 3, 4, 6, 12] as const;

/** Year and month (1-12) of `now` in Swedish time. */
function yearMonth(now: number): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: RESET_TIME_ZONE, year: "numeric", month: "numeric" }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  return { year: get("year"), month: get("month") };
}

/** The period `now` belongs to, e.g. "2026-4" for October to December with every = 3. A new period means a reset. */
export function resetPeriod(now: number, every: number): string {
  const { year, month } = yearMonth(now);
  return `${year}-${Math.floor((month - 1) / every) + 1}`;
}

/** The day of the next reset as YYYY-MM-DD (Swedish calendar day). */
export function nextReset(now: number, every: number): string {
  const { year, month } = yearMonth(now);
  const next = (Math.floor((month - 1) / every) + 1) * every + 1; // first month of the next period, 13 = January next year
  const y = next > 12 ? year + 1 : year;
  const m = next > 12 ? next - 12 : next;
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

const PERIOD_KEY = "rensad-period";

/**
 * Removes everything when a new period has begun. A database that has never been reset only remembers the current period:
 * turning the setting on (or a new instance) does not remove what is there now. A copy is made first with `backup`; if it
 * fails nothing is removed, and the next check tries again.
 */
export function resetIfDue(
  store: Store,
  every: number,
  now: number,
  backup: (stamp: string) => void,
  log: (message: string, level?: string) => void,
): "first" | "not-due" | "reset" | "backup-failed" {
  const period = resetPeriod(now, every);
  const last = store.getMeta(PERIOD_KEY);
  if (last === null) {
    store.setMeta(PERIOD_KEY, period);
    return "first";
  }
  if (last === period) return "not-due";
  try {
    backup(`${new Date(now).toISOString().slice(0, 10)}-fore-rensning`);
  } catch (err) {
    log(`rensningen väntar: säkerhetskopian misslyckades: ${String(err)}`, "error");
    return "backup-failed";
  }
  const removed = store.removeAll();
  store.setMeta(PERIOD_KEY, period);
  log(`rensning för perioden ${period}: ${removed} namn och deras framsteg borttagna`);
  return "reset";
}
