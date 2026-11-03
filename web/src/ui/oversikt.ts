// The course overview: where you are, and every module with its lessons and what is done.
import { alla, fortsatt, kurs, lektionKlar, modulMinuter, totalMinuter, uppgifter, visaTid, type Klara } from "../kurs.ts";
import { config } from "../config.ts";
import { lank } from "../router.ts";
import { h } from "./dom.ts";

export function visaOversikt(rot: HTMLElement, namn: string, senast: string | null, klar: Klara): void {
  const lektioner = alla();
  const klaraAntal = lektioner.filter((l) => lektionKlar(l, klar)).length;
  const dit = fortsatt(senast, klar);
  const harBorjat = lektioner.some((l) => uppgifter(l).some((b) => klar(b.id))) || senast !== null;

  const delar: (Node | null)[] = [
    h("h1", { tabindex: "-1", id: "sidtitel" }, "Programmeringskurs"),
    config().lage === "privat" ? h("p", { class: "personlig" }, "Jag önskar att du får nytta av informationen, och att den kanske kan hjälpa dig på något sätt.", h("br"), "Älskar dig!") : null,
    h("p", { class: "valkomst" }, harBorjat ? `Välkommen tillbaka, ${namn}.` : `Välkommen, ${namn}. Det här är en kurs som lär dig programmera i Python, steg för steg. Du behöver inga förkunskaper.`),
    dit ? h("p", {}, h("a", { class: "knapp-lank stor", href: lank({ vy: "lektion", id: dit.id }) }, harBorjat ? `Fortsätt där du var: ${dit.titel}` : `Börja: ${dit.titel}`)) : null,
    h("p", { class: "hjalp" }, `Du har gjort ${klaraAntal} av ${lektioner.length} lektioner. Alla lektioner tillsammans tar ${visaTid(totalMinuter())} för en nybörjare, men modul 8 och 10 är valfria och du väljer själv vilket projekt du gör i modul 9. Varje lektion visar sin egen tid.`),
    h(
      "section",
      { class: "intro" },
      h("h2", {}, "Så använder du kursen"),
      h("h3", {}, "Så är varje lektion uppbyggd"),
      h(
        "ol",
        {},
        h("li", {}, h("strong", {}, "Prova."), " Ett exempel som du kör och ändrar."),
        h("li", {}, h("strong", {}, "Läs."), " Några korta stycken som förklarar vad som hände."),
        h("li", {}, h("strong", {}, "Test."), " Du svarar på en fråga om vad som händer ", h("em", {}, "innan"), " du kör. Det är ett bra sätt att lära sig."),
        h("li", {}, h("strong", {}, "Övning."), " Små uppgifter där du skriver koden."),
      ),
      h("p", {}, "Det finns inga poäng, ingen tid och ingen som tittar. Du kan gå tillbaka och göra om vad du vill. Din kod och dina framsteg sparas under ditt namn, så om du öppnar kursen på en annan dator väljer du ditt namn och fortsätter där du var."),
      h("h3", {}, "Knapparna"),
      h(
        "ul",
        {},
        h("li", {}, h("strong", {}, "Kör"), " kör koden och visar resultatet."),
        h("li", {}, h("strong", {}, "Stoppa"), " avbryter ett program som inte tar slut."),
        h("li", {}, h("strong", {}, "Stegvis"), " visar vad som händer rad för rad och hur saker ändras. Du får använda den när du vill förstå varför ett program gör som det gör."),
        h("li", {}, h("strong", {}, "Kontrollera"), " (i uppgifter) säger om det du skrev stämmer, och var det skiljer sig om det inte gör det."),
        h("li", {}, h("strong", {}, "Ledtråd"), " ger en liten hjälp i taget, tre steg. Facit finns alltid, men du måste välja att visa det."),
        h("li", {}, h("strong", {}, "Börja om"), " sätter tillbaka den ursprungliga koden."),
      ),
      h("h3", {}, "Menyn och orden i lektionerna"),
      h(
        "ul",
        {},
        h("li", {}, h("strong", {}, "Ordlista"), " (i menyn högst upp) förklarar orden som används i kursen. Du kan slå upp ett ord där när du vill."),
        h("li", {}, h("strong", {}, "Jag har fastnat"), " (i menyn) är en lista med saker att prova, i tur och ordning, när något inte fungerar som du tänkt."),
        h("li", {}, h("strong", {}, "Visning"), " (i menyn) ändrar hur sidan ser ut: textstorlek (Liten, Normal, Stor, Större) och färger (ljust, mörkt eller som din enhet). Valet sparas på den här enheten."),
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
