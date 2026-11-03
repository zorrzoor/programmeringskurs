// Validation of everything that comes from a client: names, ids, code, bodies.
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

// A name is what a person types ("Anna", "Åsa-Lena"): letters, digits, spaces and hyphens.

export const MAX_NAME_LENGTH = 30;
export const MAX_CODE_BYTES = 20 * 1024;
export const MAX_BODY_BYTES = 64 * 1024;

const NAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} -]*$/u;
const ID_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/;

/** The display name (trimmed, single spaces, NFC), or null when it is not acceptable. */
export function cleanName(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const name = raw.normalize("NFC").trim().replace(/\s+/g, " ");
  if (name.length < 1 || [...name].length > MAX_NAME_LENGTH || !NAME_RE.test(name)) return null;
  return name;
}

/** Case-insensitive identity of a name: "anna" and "ANNA" are the same person. */
export function nameKey(name: string): string {
  return name.toLocaleLowerCase("sv");
}

export function cleanId(raw: unknown): string | null {
  return typeof raw === "string" && ID_RE.test(raw) ? raw : null;
}

export function cleanCode(raw: unknown): string | null {
  return typeof raw === "string" && Buffer.byteLength(raw) <= MAX_CODE_BYTES ? raw : null;
}

export function cleanTime(raw: unknown): number | null {
  return typeof raw === "number" && Number.isSafeInteger(raw) && raw >= 0 ? raw : null;
}

// The access code of a name in the public instance: 12 characters without look-alikes (no 0/O, 1/I/L), written XXXX-XXXX-XXXX.
// 31^12 is about 2^59, too many to guess. Only a hash of it is stored.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function newCode(random: (n: number) => Uint8Array = (n) => randomBytes(n)): string {
  const chars: string[] = [];
  // Rejection sampling: 248 = 8 * 31, so bytes below it map evenly onto the alphabet.
  while (chars.length < 12) for (const b of random(16)) if (b < 248 && chars.length < 12) chars.push(CODE_ALPHABET[b % 31] as string);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8).join("")}`;
}

/** The code in its canonical form (upper case, no separators), or null when it cannot be a code. */
export function cleanAccessCode(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const code = raw.toUpperCase().replace(/[\s-]/g, "");
  return code.length === 12 && [...code].every((c) => CODE_ALPHABET.includes(c)) ? code : null;
}

export function hashCode(code: string): string {
  return createHash("sha256").update(code).digest("hex");
}

export function sameHash(a: string, b: string): boolean {
  const x = Buffer.from(a, "hex");
  const y = Buffer.from(b, "hex");
  return x.length === y.length && timingSafeEqual(x, y);
}
