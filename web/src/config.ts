// Which kind of instance this is (the server's KURS_LAGE): "privat" sits behind Cloudflare Access, "publik" does not.
// Fetched once at start. If it cannot be fetched the page says so and offers to try again (#190): falling back to the private
// mode would show the public instance's learners a picker without the code field.
import type { Api } from "./api.ts";

export interface ClientConfig {
  lage: "privat" | "publik";
  maxNamn: number;
  /** The day of the next reset, YYYY-MM-DD (#165); null when nothing is reset. */
  nastaRensning: string | null;
  /** Months between resets (3 = each quarter); null when nothing is reset. */
  rensaVarje: number | null;
}

let current: ClientConfig = { lage: "privat", maxNamn: 50, nastaRensning: null, rensaVarje: null };

export const config = (): ClientConfig => current;

/** True when the server's mode was read. */
export async function loadConfig(api: Api): Promise<boolean> {
  try {
    current = { nastaRensning: null, rensaVarje: null, ...(await api.getConfig()) };
    return true;
  } catch {
    return false;
  }
}

/** For tests. */
export function setConfig(next: Partial<ClientConfig>): void {
  current = { lage: "privat", maxNamn: 50, nastaRensning: null, rensaVarje: null, ...next };
}
