// Which kind of instance this is (the server's KURS_LAGE): "privat" sits behind Cloudflare Access, "publik" does not.
// Fetched once at start. If the server cannot be reached the private defaults apply (the same as before this existed).
import type { Api } from "./api.ts";

export interface ClientConfig {
  lage: "privat" | "publik";
  maxNamn: number;
}

let current: ClientConfig = { lage: "privat", maxNamn: 50 };

export const config = (): ClientConfig => current;

export async function loadConfig(api: Api): Promise<void> {
  try {
    current = await api.getConfig();
  } catch {
    // keep the defaults
  }
}

/** For tests. */
export function setConfig(next: Partial<ClientConfig>): void {
  current = { lage: "privat", maxNamn: 50, ...next };
}
