// The glossary: every word with a short explanation, in alphabetical order. A link from a lesson (#/ordlista/<id>)
// opens the page at that word and marks it.
import { kurs } from "../kurs.ts";
import { h } from "./dom.ts";

export const ordAnkare = (id: string): string => `ord-${id}`;

export function visaOrdlista(rot: HTMLElement, markerad?: string): void {
  const ord = [...kurs.ordlista].sort((a, b) => a.ord.localeCompare(b.ord, "sv", { sensitivity: "base" }));
  const lista = (urval: typeof ord) =>
    h(
      "dl",
      { class: "ordlista" },
      ...urval.flatMap((o) => [
        h("dt", { id: ordAnkare(o.id), class: o.id === markerad ? "markerad" : "" }, o.python ? h("code", {}, o.ord) : o.ord),
        h("dd", { class: o.id === markerad ? "markerad" : "" }, o.forklaring),
      ]),
    );
  rot.replaceChildren(
    h("h1", { tabindex: "-1", id: "sidtitel" }, "Ordlista"),
    h("p", { class: "hjalp" }, "Korta förklaringar av orden i kursen. I lektionerna är första gången ett ord förekommer i en modul en länk hit."),
    h("p", {}, h("button", { type: "button", class: "sekundar", onclick: () => history.back() }, "← Tillbaka")),
    lista(ord.filter((o) => !o.python)),
    // #205: Python's English words with their Swedish meaning, for the learner who forgot what `continue` means.
    h("h2", {}, "Pythons ord"),
    h("p", { class: "hjalp" }, "Python använder engelska ord. Här står vad de betyder på svenska och vad de gör."),
    lista(ord.filter((o) => o.python)),
  );
}
