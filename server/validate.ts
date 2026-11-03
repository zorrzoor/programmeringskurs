// Validation of everything that comes from a client: names, ids, code, bodies.
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
