// The course data and what can be asked of it. The data (generated/kurs.json) is written by the build step.
import type { Block, Kurs, Lektion, Modul } from "./kurs-typer.ts";
import data from "./generated/kurs.json";

export const kurs = data as Kurs;

export const alla = (k: Kurs = kurs): Lektion[] => k.moduler.flatMap((m) => m.lektioner);

export function hittaLektion(id: string, k: Kurs = kurs): Lektion | undefined {
  return alla(k).find((l) => l.id === id);
}

export const modulAv = (l: Lektion, k: Kurs = kurs): Modul => k.moduler.find((m) => m.id === l.modul) as Modul;

/** The blocks of a lesson that the learner has to do, and that count as progress. */
export function uppgifter(l: Lektion): (Block & { typ: "ovning" | "forutsag" })[] {
  return l.block.filter((b): b is Block & { typ: "ovning" | "forutsag" } => b.typ === "ovning" || b.typ === "forutsag");
}

/** Which tasks are done, by id. */
export type Klara = (id: string) => boolean;

export function lektionKlar(l: Lektion, klar: Klara): boolean {
  const u = uppgifter(l);
  return u.length > 0 && u.every((b) => klar(b.id));
}

export function grannar(id: string, k: Kurs = kurs): { forra?: Lektion; nasta?: Lektion } {
  const a = alla(k);
  const i = a.findIndex((l) => l.id === id);
  return { forra: a[i - 1], nasta: a[i + 1] };
}

/** Where "Fortsätt där du var" goes: the last lesson if it is not done, else the first lesson that is not done. */
export function fortsatt(senast: string | null, klar: Klara, k: Kurs = kurs): Lektion | undefined {
  const a = alla(k);
  const last = senast ? a.find((l) => l.id === senast) : undefined;
  if (last && !lektionKlar(last, klar)) return last;
  const forstaOklara = a.find((l) => !lektionKlar(l, klar));
  return forstaOklara ?? last ?? a[0];
}
