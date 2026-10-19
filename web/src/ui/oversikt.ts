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
    h("p", { class: "personlig" }, "Jag önskar att du får nytta av informationen, och att den kanske kan hjälpa dig på något sätt.", h("br"), "Älskar dig!"),
    h("p", { class: "valkomst" }, harBorjat ? `Välkommen tillbaka, ${namn}.` : `Välkommen, ${namn}. Det här är en kurs som lär dig programmera i Python, steg för steg. Du behöver inga förkunskaper.`),
    dit ? h("p", {}, h("a", { class: "knapp-lank stor", href: lank({ vy: "lektion", id: dit.id }) }, harBorjat ? `Fortsätt där du var: ${dit.titel}` : `Börja: ${dit.titel}`)) : null,
    h("p", { class: "hjalp" }, `Du har gjort ${klaraAntal} av ${lektioner.length} lektioner. Alla lektioner tillsammans tar ${visaTid(totalMinuter())} för en nybörjare, men modul 8 och 10 är valfria och du väljer själv vilket projekt du gör i modul 9. Varje lektion visar sin egen tid.`),
    h(
      "section",
      { class: "intro" },
      h("h2", {}, "Så använder du kursen"),
      h(
        "ul",
        {},
        h("li", {}, h("strong", {}, "Ordlista"), " (i menyn högst upp) förklarar orden som används i kursen. Du kan slå upp ett ord där när du vill."),
        h("li", {}, h("strong", {}, "Jag har fastnat"), " (i menyn) är en lista med saker att prova, i tur och ordning, när något inte fungerar som du tänkt."),
        h("li", {}, h("strong", {}, "Visning"), " (i menyn) ändrar hur sidan ser ut: textstorlek (Normal, Stor, Större) och färger (ljust, mörkt eller som din enhet). Valet sparas på den här enheten."),
        h("li", {}, h("strong", {}, "Blå, understrukna ord i lektionerna"), " är länkar till ordlistan. Första gången ett ord förekommer i en modul är det en länk. Tryck på ordet för att läsa vad det betyder, och på webbläsarens bakåtknapp för att komma tillbaka till lektionen."),
        h("li", {}, h("strong", {}, "Programmeringskurs"), " högst upp till vänster är en länk som alltid tar dig tillbaka hit, till startsidan."),
      ),
    ),
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
