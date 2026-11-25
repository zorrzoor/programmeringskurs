// What the public instance says about its reset (#165): all names and progress are removed each quarter. The server sends the
// day of the next reset (YYYY-MM-DD, Swedish time) in /api/config, or null when nothing is reset (the private instance).

/** Days before the reset when every page shows a warning. */
export const WARN_DAYS = 7;

const MONTHS = ["januari", "februari", "mars", "april", "maj", "juni", "juli", "augusti", "september", "oktober", "november", "december"];

/** Year, month (1-12) and day of YYYY-MM-DD. */
function parts(day: string): [number, number, number] {
  const [y = NaN, m = NaN, d = NaN] = day.split("-").map(Number);
  return [y, m, d];
}

/** "1 januari 2027". */
export function rensningsdag(day: string): string {
  const [y, m, d] = parts(day);
  return `${d} ${MONTHS[m - 1] ?? ""} ${y}`;
}

const HOW_OFTEN: Record<number, string> = {
  1: "varje månad",
  2: "varannan månad",
  3: "varje kvartal",
  4: "var fjärde månad",
  6: "varje halvår",
  12: "en gång om året",
};

/** "varje kvartal" for 3 months. */
export function hurOfta(every: number): string {
  return HOW_OFTEN[every] ?? `var ${every}:e månad`;
}

/** The reset days of a year: "1 januari, 1 april, 1 juli och 1 oktober" for every 3 months. */
function resetDays(every: number): string {
  const days = MONTHS.filter((_, i) => i % every === 0).map((m) => `1 ${m}`);
  const last = days.pop() ?? "";
  return days.length === 0 ? last : `${days.join(", ")} och ${last}`;
}

/** The sentence on the start page and the privacy page; "" when nothing is reset. */
export function rensningsText(nasta: string | null, every: number | null): string {
  if (nasta === null || every === null) return "";
  const when = every === 1 ? "den första varje månad" : resetDays(every);
  return `Alla namn och framsteg tas bort ${hurOfta(every)} (${when}). Nästa gång: ${rensningsdag(nasta)}.`;
}

/** Whole days left until the reset day, counted in calendar days; null when there is no reset. */
export function dagarKvar(nasta: string | null, now: Date): number | null {
  if (nasta === null) return null;
  const [y, m, d] = parts(nasta);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((Date.UTC(y, m - 1, d) - today) / 86_400_000);
}

/** The warning on every page in the last WARN_DAYS days, otherwise null. */
export function rensningsVarning(nasta: string | null, now: Date): string | null {
  const kvar = dagarKvar(nasta, now);
  if (kvar === null || kvar > WARN_DAYS || kvar < 0) return null;
  const nar = kvar <= 1 ? "i natt" : `om ${kvar} dagar`;
  return `Alla namn och framsteg tas bort ${nar} (${rensningsdag(nasta as string)}). Spara koden du vill behålla på din egen dator.`;
}
