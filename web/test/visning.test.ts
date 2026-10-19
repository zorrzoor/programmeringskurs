import { beforeEach, describe, expect, test } from "vitest";
import { skapaVisningsval } from "../src/ui/visning.ts";
import { KEY, lasVisning, sparaVisning, STANDARD, tillampaVisning } from "../src/visning.ts";

const minne = (start: Record<string, string> = {}): Storage => {
  const d = { ...start };
  return { getItem: (k: string) => d[k] ?? null, setItem: (k: string, v: string) => void (d[k] = v), removeItem: (k: string) => void delete d[k], clear: () => {}, key: () => null, length: 0 } as Storage;
};
const blockerat = (): Storage =>
  ({ getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); } }) as unknown as Storage;

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.text;
  delete document.documentElement.dataset.tema;
});

describe("visning", () => {
  test("defaults when nothing is stored, when the value is broken, and when storage is blocked", () => {
    expect(lasVisning(minne())).toEqual(STANDARD);
    expect(lasVisning(minne({ [KEY]: "inte json" }))).toEqual(STANDARD);
    expect(lasVisning(minne({ [KEY]: JSON.stringify({ text: "enorm", tema: "rosa" }) }))).toEqual(STANDARD);
    expect(lasVisning(blockerat())).toEqual(STANDARD);
    expect(lasVisning(null)).toEqual(STANDARD);
  });

  test("a saved setting is read back, and saving into blocked storage does not throw", () => {
    const s = minne();
    sparaVisning({ text: "storre", tema: "morkt" }, s);
    expect(lasVisning(s)).toEqual({ text: "storre", tema: "morkt" });
    expect(() => sparaVisning({ text: "stor", tema: "ljust" }, blockerat())).not.toThrow();
  });

  test("applying sets the attributes the style sheet reacts to", () => {
    tillampaVisning({ text: "stor", tema: "ljust" });
    expect(document.documentElement.dataset.text).toBe("stor");
    expect(document.documentElement.dataset.tema).toBe("ljust");
  });
});

describe("Visning menu", () => {
  test("has labelled choices that apply and remember the setting", () => {
    const meny = skapaVisningsval();
    document.body.append(meny);
    const radios = [...meny.querySelectorAll<HTMLInputElement>("input[type=radio]")];
    expect(radios).toHaveLength(6);
    for (const r of radios) expect(meny.querySelector(`label[for="${r.id}"]`)?.textContent).not.toBe("");
    expect(radios.find((r) => r.value === "normal")?.checked).toBe(true);
    const stor = radios.find((r) => r.value === "stor") as HTMLInputElement;
    stor.checked = true;
    stor.dispatchEvent(new Event("change"));
    const morkt = radios.find((r) => r.value === "morkt") as HTMLInputElement;
    morkt.checked = true;
    morkt.dispatchEvent(new Event("change"));
    expect(document.documentElement.dataset.text).toBe("stor");
    expect(document.documentElement.dataset.tema).toBe("morkt");
    expect(lasVisning()).toEqual({ text: "stor", tema: "morkt" });
    // a new menu starts from what is stored
    const igen = skapaVisningsval();
    expect([...igen.querySelectorAll<HTMLInputElement>("input:checked")].map((r) => r.value).sort()).toEqual(["morkt", "stor"]);
    meny.remove();
  });
});
