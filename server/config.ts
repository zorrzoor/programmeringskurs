import { ALLOWED_RESET_MONTHS } from "./rensning.ts";

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
  /** Saved exercises per name (#195): the course has about 250, so this only stops a name that writes made-up ids. */
  maxExercisesPerName: number;
  /** Size of the database in bytes above which nothing new is stored (#195): the volume also holds 7 daily copies. */
  maxDbBytes: number;
  /** HTTP(S) port. */
  port: number;
  /** Directory for the daily copies of the database; "" = no copies. */
  backupDir: string;
  /** How many daily copies to keep (at least 1, #200: 0 or an invalid value used to remove them all). */
  backupKeep: number;
  /** Remove all names and progress every this many months (#165, server/rensning.ts); 0 = never. */
  resetEveryMonths: number;
}

export const DEFAULT_MAX_NAMES = 50;
export const DEFAULT_WRITES_PER_MINUTE = 300;
export const DEFAULT_MAX_EXERCISES_PER_NAME = 500;
export const DEFAULT_MAX_DB_MB = 256;
export const DEFAULT_PORT = 8080;
export const DEFAULT_BACKUP_KEEP = 7;

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

function port(raw: string | undefined): number {
  const value = positiveInt(raw, DEFAULT_PORT, "PORT");
  if (value > 65535) throw new Error(`PORT must be at most 65535, got "${raw}"`);
  return value;
}

function resetMonths(raw: string | undefined): number {
  const value = nonNegativeInt(raw, "RESET_EVERY_MONTHS");
  if (value !== 0 && !(ALLOWED_RESET_MONTHS as readonly number[]).includes(value)) {
    throw new Error(`RESET_EVERY_MONTHS must be 0 or one of ${ALLOWED_RESET_MONTHS.join(", ")}, got "${raw}"`);
  }
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
    maxExercisesPerName: positiveInt(env.MAX_EXERCISES_PER_NAME, DEFAULT_MAX_EXERCISES_PER_NAME, "MAX_EXERCISES_PER_NAME"),
    maxDbBytes: positiveInt(env.MAX_DB_MB, DEFAULT_MAX_DB_MB, "MAX_DB_MB") * 1024 * 1024,
    port: port(env.PORT),
    backupDir: env.BACKUP_DIR ?? "",
    backupKeep: positiveInt(env.BACKUP_KEEP, DEFAULT_BACKUP_KEEP, "BACKUP_KEEP"),
    resetEveryMonths: resetMonths(env.RESET_EVERY_MONTHS),
  };
}
