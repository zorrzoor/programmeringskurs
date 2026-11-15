// Which kind of instance this is (the server's KURS_LAGE): "privat" sits behind Cloudflare Access, "publik" does not.
// Fetched once at start. If it cannot be fetched the page says so and offers to try again (#190): falling back to the private
// mode would show the public instance's learners a picker without the code field.
import type { Api } from "./api.ts";

export interface ClientConfig {
  lage: "privat" | "publik";
  maxNamn: number;
}

let current: ClientConfig = { lage: "privat", maxNamn: 50 };

export const config = (): ClientConfig => current;

/** True when the server's mode was read. */
export async function loadConfig(api: Api): Promise<boolean> {
  try {
    current = await api.getConfig();
    return true;
  } catch {
    return false;
  }
}

/** For tests. */
export function setConfig(next: Partial<ClientConfig>): void {
  current = { lage: "privat", maxNamn: 50, ...next };
}
