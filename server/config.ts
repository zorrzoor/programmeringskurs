// Settings that differ between instances of the same image (read from the environment at start).
// "privat" is the instance behind Cloudflare Access; "publik" has no access control in front of it.

export type Lage = "privat" | "publik";

export interface Config {
  lage: Lage;
  maxNames: number;
  writesPerMinute: number;
  /** Abuse protection for the public instance. 0 = off. */
  newNamesPerIpPerDay: number;
  newNamesPerHour: number;
  /** Names without any saved work are removed after this many hours (0 = never). */
  unusedNameHours: number;
  /** No new names at all (a switch for the owner). */
  namesClosed: boolean;
}

export const DEFAULT_MAX_NAMES = 50;
export const DEFAULT_WRITES_PER_MINUTE = 300;

function positiveInt(raw: string | undefined, fallback: number, name: string): number {
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 1) throw new Error(`${name} must be a positive integer, got "${raw}"`);
  return value;
}

function nonNegativeInt(raw: string | undefined, name: string): number {
  if (raw === undefined || raw === "") return 0;
  const value = Number(raw);
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name} must be a non-negative integer, got "${raw}"`);
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
    newNamesPerIpPerDay: nonNegativeInt(env.NEW_NAMES_PER_IP_PER_DAY, "NEW_NAMES_PER_IP_PER_DAY"),
    newNamesPerHour: nonNegativeInt(env.NEW_NAMES_PER_HOUR, "NEW_NAMES_PER_HOUR"),
    unusedNameHours: nonNegativeInt(env.UNUSED_NAME_HOURS, "UNUSED_NAME_HOURS"),
    namesClosed: env.NAMES_CLOSED === "1" || env.NAMES_CLOSED === "true",
  };
}
