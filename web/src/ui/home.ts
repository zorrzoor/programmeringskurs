// The course overview. For now a placeholder that shows the saved progress; the lessons come with the
// lesson format and the content issues.
import type { Progress } from "../api.ts";
import type { SaveStatus } from "../sync.ts";
import { clear, h } from "./dom.ts";

const STATUS_TEXT: Record<SaveStatus, string> = {
  sparat: "Sparat",
  sparas: "Sparas …",
  offline: "Sparas när du är online igen",
  fel: "Kunde inte spara. Försöker igen strax.",
};

export interface Home {
  setStatus: (status: SaveStatus) => void;
}

export function showHome(root: HTMLElement, name: string, progress: Progress, onSwitch: () => void): Home {
  clear(root);
  const status = h("p", { class: "status", role: "status" }, STATUS_TEXT.sparat);
  const done = Object.values(progress.ovningar).filter((e) => e.klar).length;
  root.append(
    h("header", {}, h("h1", {}, "Programmeringskurs"), h("p", {}, `Du är inloggad som ${name}. `, h("button", { type: "button", class: "link", onclick: onSwitch }, "Byt namn"))),
    h("main", {}, h("p", {}, `Välkommen, ${name}. Kursen byggs just nu.`), h("p", {}, `Klara övningar hittills: ${done}.`)),
    status,
  );
  return {
    setStatus(s) {
      status.textContent = STATUS_TEXT[s];
    },
  };
}
