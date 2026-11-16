// The access codes of this device's names (public instance), so the learner does not have to type the code every time.
// Only in the browser's localStorage; if it is blocked the code is asked for each time.
const KEY = "kurs.koder";

const read = (): Record<string, string> => {
  try {
    const value: unknown = JSON.parse(globalThis.localStorage?.getItem(KEY) ?? "{}");
    return value !== null && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, string>) : {};
  } catch {
    return {};
  }
};
const write = (koder: Record<string, string>): void => {
  try {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(koder));
  } catch {
    // not remembered
  }
};
const key = (namn: string): string => namn.toLocaleLowerCase("sv");

export const hamtaKod = (namn: string): string | null => read()[key(namn)] ?? null;
export const sparaKod = (namn: string, kod: string): void => write({ ...read(), [key(namn)]: kod });
export function glomKod(namn: string): void {
  const koder = read();
  delete koder[key(namn)];
  write(koder);
}

/** The characters of a code, as the server makes them (server/validate.ts). */
const ALFABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const KOD_HJALP = "Koden ska vara tolv tecken, bokstäver och siffror, till exempel K7QM-4TXA-9R2D.";

/**
 * What the learner typed as a code, cleaned as the server does: upper case, without spaces and any kind of dash (an en dash
 * from copying or autocorrect, a minus sign …). Returns K7QM-4TXA-9R2D, or null when it cannot be a code (#199): then no
 * request is made, and a character outside Latin-1 can never reach the header (fetch would throw, which looked like a
 * network error).
 */
export function rensaKod(raw: string): string | null {
  const kod = raw.toUpperCase().replace(/[\s\p{Pd}\u2212_.]/gu, "");
  if (kod.length !== 12 || ![...kod].every((c) => ALFABET.includes(c))) return null;
  return `${kod.slice(0, 4)}-${kod.slice(4, 8)}-${kod.slice(8)}`;
}
