// What to do when the progress of a remembered or chosen name cannot be loaded at start (#190). Only an answer that says the
// name is gone or the code is wrong may forget the code: a lost code cannot be recovered. A server that is restarting
// (5xx, Recreate during a deploy) or a rate limit (429) keeps everything and offers to try again.
import { errorKind } from "./sync.ts";

export type LoadFailure =
  | { visa: "forsok-igen" }
  | { visa: "namnval"; glomKod: boolean; notice?: string };

/** The notice shown in the picker when a name is lost (also used when saving stops, #194). */
export const LOST_TEXT: Record<string, string> = {
  "okant-namn": "Namnet finns inte längre (det togs bort på en annan enhet eller rensades). Det du skrivit sedan dess finns kvar i den här webbläsaren, men kan inte sparas under namnet. Välj eller skapa ett namn.",
  "fel-kod": "Koden för namnet stämmer inte längre. Öppna namnet igen med koden.",
};

export function loadFailure(err: unknown, lage: "privat" | "publik"): LoadFailure {
  const kind = errorKind(err);
  if (kind === "tillfalligt") return { visa: "forsok-igen" };
  if (kind === "namn") {
    const code = (err as { code: string }).code;
    return { visa: "namnval", glomKod: lage === "publik", notice: LOST_TEXT[code] ?? LOST_TEXT["okant-namn"] };
  }
  return { visa: "namnval", glomKod: false }; // another refusal (a bad name …): choose again, the code stays
}
