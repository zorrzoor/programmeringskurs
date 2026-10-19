// Display settings that belong to the device, not to the learner's name: text size and colours. They are kept in the
// browser (localStorage, which can be blocked: then the defaults are used) and applied as attributes on <html>, which
// the style sheet reacts to.
export type Textstorlek = "liten" | "normal" | "stor" | "storre";
export type Tema = "auto" | "ljust" | "morkt";
export interface Visning {
  text: Textstorlek;
  tema: Tema;
}

export const STANDARD: Visning = { text: "normal", tema: "auto" };
export const KEY = "kurs-visning";
const TEXT: Textstorlek[] = ["liten", "normal", "stor", "storre"];
const TEMA: Tema[] = ["auto", "ljust", "morkt"];

function lagring(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function lasVisning(storage: Storage | null = lagring()): Visning {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return { ...STANDARD };
    const o = JSON.parse(raw) as Partial<Visning>;
    return {
      text: TEXT.includes(o.text as Textstorlek) ? (o.text as Textstorlek) : STANDARD.text,
      tema: TEMA.includes(o.tema as Tema) ? (o.tema as Tema) : STANDARD.tema,
    };
  } catch {
    return { ...STANDARD };
  }
}

export function sparaVisning(v: Visning, storage: Storage | null = lagring()): void {
  try {
    storage?.setItem(KEY, JSON.stringify(v));
  } catch {
    // the setting then only lasts until the page is closed
  }
}

export function tillampaVisning(v: Visning, root: HTMLElement = document.documentElement): void {
  root.dataset.text = v.text;
  root.dataset.tema = v.tema;
}
