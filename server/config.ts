// Settings that differ between instances of the same image (read from the environment at start).
// "privat" is the instance behind Cloudflare Access; "publik" has no access control in front of it.

export type Lage = "privat" | "publik";

export interface Config {
  lage: Lage;
  maxNames: number;
  writesPerMinute: number;
}

export const DEFAULT_MAX_NAMES = 50;
export const DEFAULT_WRITES_PER_MINUTE = 300;

function positiveInt(raw: string | undefined, fallback: number, name: string): number {
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} must be a positive integer, got "${raw}"`);
  return value;
}

/** Throws on an invalid value: better to refuse to start than to run with a setting nobody meant. */
export function readConfig(env: Record<string, string | undefined>): Config {
  const lage = env.KURS_LAGE ?? "privat";
  if (lage !== "privat" && lage !== "publik") throw new Error(`KURS_LAGE must be "privat" or "publik", got "${lage}"`);
  return {
    lage,
    maxNames: positiveInt(env.MAX_NAMES, DEFAULT_MAX_NAMES, "MAX_NAMES"),
    writesPerMinute: positiveInt(env.WRITES_PER_MINUTE, DEFAULT_WRITES_PER_MINUTE, "WRITES_PER_MINUTE"),
  };
}
