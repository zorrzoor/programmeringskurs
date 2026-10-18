// The same rules as the server (server/validate.ts): a name is 1-30 characters, letters, digits, spaces and
// hyphens. The server decides; this only gives a friendly message before the request is sent.
export const MAX_NAME_LENGTH = 30;
const NAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} -]*$/u;

/** The cleaned name, or null when it is not acceptable. */
export function cleanName(raw: string): string | null {
  const name = raw.normalize("NFC").trim().replace(/\s+/g, " ");
  if (name.length < 1 || [...name].length > MAX_NAME_LENGTH || !NAME_RE.test(name)) return null;
  return name;
}

export const NAME_HELP = "Skriv ett namn med 1–30 tecken: bokstäver, siffror, mellanslag och bindestreck.";
