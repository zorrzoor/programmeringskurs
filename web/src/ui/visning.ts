// The "Visning" menu: text size and colours, kept on this device (src/visning.ts).
import { lasVisning, sparaVisning, tillampaVisning, type Tema, type Textstorlek, type Visning } from "../visning.ts";
import { h } from "./dom.ts";

const TEXT: [Textstorlek, string][] = [
  ["liten", "Liten"],
  ["normal", "Normal"],
  ["stor", "Stor"],
  ["storre", "Större"],
];
const TEMA: [Tema, string][] = [
  ["auto", "Som enheten"],
  ["ljust", "Ljust"],
  ["morkt", "Mörkt"],
];

export function skapaVisningsval(): HTMLElement {
  let nu: Visning = lasVisning();
  const grupp = <T extends string>(namn: string, rubrik: string, val: [T, string][], vald: T, satt: (v: T) => void) =>
    h(
      "fieldset",
      { class: "visningsgrupp" },
      h("legend", {}, rubrik),
      ...val.map(([v, text]) => {
        const id = `visning-${namn}-${v}`;
        const radio = h("input", { type: "radio", name: `visning-${namn}`, id, value: v });
        (radio as HTMLInputElement).checked = v === vald;
        radio.addEventListener("change", () => satt(v));
        return h("span", { class: "val" }, radio, h("label", { for: id }, text));
      }),
    );
  const ny = (andring: Partial<Visning>) => {
    nu = { ...nu, ...andring };
    sparaVisning(nu);
    tillampaVisning(nu);
  };
  return h(
    "details",
    { class: "visning" },
    h("summary", {}, "Visning"),
    grupp("text", "Textstorlek", TEXT, nu.text, (text) => ny({ text })),
    grupp("tema", "Färger", TEMA, nu.tema, (tema) => ny({ tema })),
  );
}
