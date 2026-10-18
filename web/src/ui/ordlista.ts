// The glossary: every word with a short explanation, in alphabetical order. A link from a lesson (#/ordlista/<id>)
// opens the page at that word and marks it.
import { kurs } from "../kurs.ts";
import { h } from "./dom.ts";

export const ordAnkare = (id: string): string => `ord-${id}`;

export function visaOrdlista(rot: HTMLElement, markerad?: string): void {
  const ord = [...kurs.ordlista].sort((a, b) => a.ord.localeCompare(b.ord, "sv", { sensitivity: "base" }));
  rot.replaceChildren(
    h("h1", { tabindex: "-1", id: "sidtitel" }, "Ordlista"),
    h("p", { class: "hjalp" }, "Korta förklaringar av orden i kursen. I lektionerna är första gången ett ord förekommer i en modul en länk hit."),
    h("p", {}, h("button", { type: "button", class: "sekundar", onclick: () => history.back() }, "← Tillbaka")),
    h(
      "dl",
      { class: "ordlista" },
      ...ord.flatMap((o) => [
        h("dt", { id: ordAnkare(o.id), class: o.id === markerad ? "markerad" : "" }, o.ord),
        h("dd", { class: o.id === markerad ? "markerad" : "" }, o.forklaring),
      ]),
    ),
  );
}
