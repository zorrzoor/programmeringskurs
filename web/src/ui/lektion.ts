// A lesson page: navigation, the goal, and the blocks in order. When the last task is done the page says so and
// points to the next lesson.
import type { Lektion } from "../kurs-typer.ts";
import { grannar, lektionKlar, modulAv, uppgifter, visaTid, type Klara } from "../kurs.ts";
import { lank } from "../router.ts";
import { renderBlock, type Kontext } from "./block.ts";
import { h } from "./dom.ts";

export function visaLektion(rot: HTMLElement, l: Lektion, ctx: Kontext, klar: Klara): void {
  const modul = modulAv(l);
  const { forra, nasta } = grannar(l.id);
  const iModulen = modul.lektioner.findIndex((x) => x.id === l.id) + 1;
  const navLank = (till: Lektion | undefined, text: string) => (till ? h("a", { class: "knapp-lank", href: lank({ vy: "lektion", id: till.id }) }, text) : null);

  const status = h("div", { class: "lektion-klar", role: "status" });
  const uppdatera = () => {
    const klarNu = lektionKlar(l, klar);
    status.replaceChildren(
      ...(klarNu
        ? [h("p", {}, "✓ Du har gjort alla uppgifter i den här lektionen. Bra jobbat!"), nasta ? h("p", {}, navLank(nasta, `Nästa lektion: ${nasta.titel} →`)) : h("p", {}, h("a", { href: lank({ vy: "oversikt" }) }, "Tillbaka till översikten"))]
        : uppgifter(l).length > 0
          ? [h("p", { class: "hjalp" }, "Gör uppgifterna ovan för att klara lektionen. Du kan gå vidare när du vill.")]
          : []),
    );
  };

  const titel = h("h1", { tabindex: "-1", id: "sidtitel" }, l.titel);
  rot.replaceChildren(
    h("nav", { class: "lektion-nav", "aria-label": "Lektion" }, h("a", { href: lank({ vy: "oversikt" }) }, "← Översikt"), h("span", {}, `Modul ${modul.id} · lektion ${iModulen} av ${modul.lektioner.length} · ${visaTid(l.minuter)}`), navLank(forra, "← Förra"), navLank(nasta, "Nästa →")),
    titel,
    h("p", { class: "mal" }, h("strong", {}, "Mål: "), l.mal),
  );
  const kontext: Kontext = { ...ctx, klarNu: () => (ctx.klarNu(), uppdatera()) };
  // One heading per part: "Test" before questions and "Övning" before exercises, unless the lesson text just before has its
  // own heading ("Steg 2: …"). Several in a row are numbered 1, 2, 3; a single one has no number and no heading of its own.
  l.block.forEach((b, i) => {
    const forra = l.block[i - 1];
    if (b.typ !== "forutsag" && b.typ !== "ovning") return void rot.append(renderBlock(b, kontext));
    const borjar = forra?.typ !== b.typ;
    if (borjar) {
      const harRubrik = forra?.typ === "text" && /(^|\n)#{1,4} [^\n]*\s*$/.test(forra.markdown);
      if (!harRubrik) rot.append(h("h2", {}, b.typ === "forutsag" ? "Test" : "Övning"));
    }
    let fran = i;
    while (l.block[fran - 1]?.typ === b.typ) fran -= 1;
    let till = i;
    while (l.block[till + 1]?.typ === b.typ) till += 1;
    rot.append(renderBlock(b, kontext, till > fran ? i - fran + 1 : undefined));
  });
  rot.append(status, h("p", { class: "hjalp" }, "Fastnat? Gå tillbaka en lektion och läs igen, eller använd ledtrådarna. Det är normalt att behöva prova flera gånger."));
  uppdatera();
}
