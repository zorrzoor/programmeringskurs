// The course overview: where you are, and every module with its lessons and what is done.
import { alla, fortsatt, kurs, lektionKlar, modulMinuter, totalMinuter, uppgifter, visaTid, type Klara } from "../kurs.ts";
import { lank } from "../router.ts";
import { h } from "./dom.ts";

export function visaOversikt(rot: HTMLElement, namn: string, senast: string | null, klar: Klara): void {
  const lektioner = alla();
  const klaraAntal = lektioner.filter((l) => lektionKlar(l, klar)).length;
  const dit = fortsatt(senast, klar);
  const harBorjat = lektioner.some((l) => uppgifter(l).some((b) => klar(b.id))) || senast !== null;

  const delar: (Node | null)[] = [
    h("h1", { tabindex: "-1", id: "sidtitel" }, "Programmeringskurs"),
    h("p", { class: "valkomst" }, harBorjat ? `Välkommen tillbaka, ${namn}.` : `Välkommen, ${namn}. Det här är en kurs som lär dig programmera i Python, steg för steg. Du behöver inga förkunskaper.`),
    dit ? h("p", {}, h("a", { class: "knapp-lank stor", href: lank({ vy: "lektion", id: dit.id }) }, harBorjat ? `Fortsätt där du var: ${dit.titel}` : `Börja: ${dit.titel}`)) : null,
    h("p", { class: "hjalp" }, `Du har gjort ${klaraAntal} av ${lektioner.length} lektioner. Hela kursen hittills tar ${visaTid(totalMinuter())} för en nybörjare; varje lektion visar sin egen tid.`),
    ...kurs.moduler.map((m) =>
      h(
        "section",
        { class: "modul" },
        h("h2", {}, `Modul ${m.id}: ${m.titel}`),
        h("p", { class: "tid" }, `${m.lektioner.length} lektioner · ${visaTid(modulMinuter(m))}`),
        h("p", { class: "beskrivning" }, m.beskrivning),
        m.kopplas ? h("p", { class: "kopplas" }, `Kopplas till: ${m.kopplas}`) : null,
        h(
          "ol",
          { class: "lektionslista", start: "1" },
          ...m.lektioner.map((l) => {
            const k = lektionKlar(l, klar);
            return h("li", {}, h("a", { href: lank({ vy: "lektion", id: l.id }) }, l.titel), h("span", { class: "tid" }, ` · ${visaTid(l.minuter)}`), k ? h("span", { class: "klar-marke" }, " ✓ klar") : null);
          }),
        ),
      ),
    ),
  ];
  rot.replaceChildren(...delar.filter((d): d is Node => d !== null));
}
