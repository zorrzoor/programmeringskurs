import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Block } from "../src/kurs-typer.ts";
import type { Kontroll, KorResultat } from "../src/py/engine.ts";
import { renderBlock, type KoerareLike, type Kontext } from "../src/ui/block.ts";
import type { Editor, EditorFabrik } from "../src/ui/editor.ts";

// A text box instead of CodeMirror.
const textEditor: EditorFabrik = (foralder, valj) => {
  const t = document.createElement("textarea");
  t.value = valj.kod;
  t.setAttribute("aria-label", valj.etikett);
  t.addEventListener("input", () => valj.onChange?.(t.value));
  foralder.append(t);
  const e: Editor = { get: () => t.value, set: (k) => (t.value = k), focus: () => t.focus(), destroy: () => t.remove() };
  return e;
};

class FakeKoerare implements KoerareLike {
  korSvar: KorResultat = { utdata: "5\n", fel: null };
  kontrollSvar: Kontroll = { ok: true, meddelanden: [], utdata: "", fel: null };
  stoppad = 0;
  koerda: string[] = [];
  start = () => Promise.resolve();
  async kor(kod: string, v?: { onUtdata?: (t: string) => void }) {
    this.koerda.push(kod);
    v?.onUtdata?.(this.korSvar.utdata);
    return this.korSvar;
  }
  async kontrollera(kod: string, _r: unknown, v?: { onUtdata?: (t: string) => void }) {
    this.koerda.push(kod);
    v?.onUtdata?.(this.kontrollSvar.utdata);
    return this.kontrollSvar;
  }
  stoppaWorker() {
    this.stoppad += 1;
  }
}

let k: FakeKoerare;
let sparat: Record<string, { kod?: string; klar?: boolean }>;
let klarAnrop: number;
const ctx = (extra: Partial<Kontext> = {}): Kontext => ({
  koerare: k,
  editor: textEditor,
  sparad: (id) => (sparat[id] ? { kod: sparat[id]?.kod ?? "", klar: Boolean(sparat[id]?.klar) } : undefined),
  spara: (id, a) => (sparat[id] = { ...sparat[id], ...a }),
  klarNu: () => (klarAnrop += 1),
  ...extra,
});
const klicka = (rot: HTMLElement, text: string | RegExp) => {
  const b = [...rot.querySelectorAll("button")].find((x) => (typeof text === "string" ? x.textContent?.includes(text) : text.test(x.textContent ?? "")));
  if (!b) throw new Error(`ingen knapp "${text}" i: ${rot.textContent}`);
  b.click();
};
const tick = () => new Promise((r) => setTimeout(r, 0));

const OVNING: Block = { typ: "ovning", id: "t-lon", uppgift: "Skriv ut `26000`.", start: "# skriv här", stdin: [], ratta: { typ: "utdata", forvantat: "26000", ignoreraVersaler: false }, ledtradar: ["Knuff", "Tydligare", "Nästan svaret"], facit: "print(26000)" };

beforeEach(() => {
  k = new FakeKoerare();
  sparat = {};
  klarAnrop = 0;
});

describe("exempel", () => {
  const B: Block = { typ: "exempel", kod: "print(2 + 3)", stdin: [] };
  test("Kör runs the code in the editor and shows the output; Börja om resets it", async () => {
    const r = renderBlock(B, ctx());
    const t = r.querySelector("textarea") as HTMLTextAreaElement;
    t.value = "print(9)";
    klicka(r, "Kör");
    await tick();
    expect(k.koerda).toEqual(["print(9)"]);
    expect(r.querySelector("pre.utdata")?.textContent).toBe("5\n");
    klicka(r, "Börja om");
    expect(t.value).toBe("print(2 + 3)");
    expect(r.querySelector("pre.utdata")?.textContent).toBe("");
  });
  test("an error is explained in Swedish with the row and Python's own text", async () => {
    k.korSvar = { utdata: "", fel: { typ: "NameError", meddelande: "name 'y' is not defined", rad: 1 } };
    const r = renderBlock(B, ctx());
    klicka(r, "Kör");
    await tick();
    const fel = r.querySelector(".fel-ruta") as HTMLElement;
    expect(fel.textContent).toContain("Python känner inte till namnet");
    expect(fel.textContent).toContain("Rad 1");
    expect(fel.textContent).toContain("NameError: name 'y' is not defined");
  });
  test("a program asking for input shows an answer box", async () => {
    let svar: Promise<string> | undefined;
    k.kor = async (_kod, v) => {
      svar = (v as { fraga: () => Promise<string> }).fraga();
      const s = await svar;
      (v as { onUtdata: (t: string) => void }).onUtdata(`Hej ${s}\n`);
      return { utdata: "", fel: null };
    };
    const r = renderBlock({ typ: "exempel", kod: "x", stdin: [] }, ctx());
    klicka(r, "Kör");
    await tick();
    const falt = r.querySelector(".svarsrad input") as HTMLInputElement;
    expect(falt).not.toBeNull();
    falt.value = "Anna";
    falt.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    await tick();
    expect(r.querySelector(".svarsrad")).toBeNull();
    expect(r.querySelector("pre.utdata")?.textContent).toBe("Anna\nHej Anna\n");
  });
  test("Stoppa replaces the worker and frees the buttons", async () => {
    k.kor = () => new Promise(() => {}); // never ends
    const r = renderBlock(B, ctx());
    klicka(r, "Kör");
    await tick();
    expect((r.querySelector("button") as HTMLButtonElement).disabled).toBe(true);
    klicka(r, "Stoppa");
    expect(k.stoppad).toBe(1);
    expect((r.querySelector("button") as HTMLButtonElement).disabled).toBe(false);
    expect(r.textContent).toContain("Du stoppade programmet");
  });
  test("Python that cannot load gives a message, not a stuck button", async () => {
    k.start = () => Promise.reject(new Error("nej"));
    const r = renderBlock(B, ctx());
    klicka(r, "Kör");
    await tick();
    expect(r.textContent).toContain("Python kunde inte laddas");
    expect((r.querySelector("button") as HTMLButtonElement).disabled).toBe(false);
  });
});

describe("forutsag", () => {
  const FLER: Block = { typ: "forutsag", id: "f1", kod: "print(1+1)", stdin: [], alternativ: ["1", "2", "11"], ratt: 1, svar: "", forklaring: "Ett plus ett är två." };
  test("multiple choice: wrong first, then right marks it done", () => {
    const r = renderBlock(FLER, ctx());
    klicka(r, "Svara");
    expect(r.textContent).toContain("Välj ett av alternativen");
    (r.querySelector("#f1-a0") as HTMLInputElement).click();
    klicka(r, "Svara");
    expect(r.textContent).toContain("Inte riktigt");
    expect(sparat.f1).toBeUndefined();
    (r.querySelector("#f1-a1") as HTMLInputElement).click();
    klicka(r, "Svara");
    expect(r.textContent).toContain("Rätt!");
    expect(sparat.f1).toEqual({ klar: true });
    expect(klarAnrop).toBe(1);
    expect((r.querySelector(".forklaring") as HTMLElement).hidden).toBe(false);
  });
  test("free text is compared forgivingly", () => {
    const r = renderBlock({ ...FLER, alternativ: [], ratt: -1, svar: "Hej" }, ctx());
    (r.querySelector("#f1-svar") as HTMLInputElement).value = "  hej ";
    klicka(r, "Svara");
    expect(r.textContent).toContain("Rätt!");
  });
  test("already done shows as done without saving again", () => {
    sparat.f1 = { klar: true };
    const r = renderBlock(FLER, ctx());
    expect((r.querySelector(".klar-marke") as HTMLElement).hidden).toBe(false);
    expect(klarAnrop).toBe(0);
  });
  test("'Kör koden och se' runs the shown code", async () => {
    const r = renderBlock(FLER, ctx());
    klicka(r, "Kör koden och se");
    await tick();
    expect(k.koerda).toEqual(["print(1+1)"]);
    expect(r.querySelector("pre.utdata")?.textContent).toBe("5\n");
  });
});

describe("ovning", () => {
  test("starts with the saved code, else the start code; typing saves", () => {
    sparat["t-lon"] = { kod: "print(1)" };
    expect((renderBlock(OVNING, ctx()).querySelector("textarea") as HTMLTextAreaElement).value).toBe("print(1)");
    sparat = {};
    const r = renderBlock(OVNING, ctx());
    const t = r.querySelector("textarea") as HTMLTextAreaElement;
    expect(t.value).toBe("# skriv här");
    t.value = "print(2)";
    t.dispatchEvent(new Event("input"));
    expect(sparat["t-lon"]).toEqual({ kod: "print(2)" });
  });
  test("right answer: message, saved as done with the code, lesson told", async () => {
    const r = renderBlock(OVNING, ctx());
    (r.querySelector("textarea") as HTMLTextAreaElement).value = "print(26000)";
    klicka(r, "Kontrollera");
    await tick();
    expect(r.textContent).toContain("Rätt! Bra jobbat.");
    expect(sparat["t-lon"]).toEqual({ kod: "print(26000)", klar: true });
    expect(klarAnrop).toBe(1);
    expect((r.querySelector(".klar-marke") as HTMLElement).hidden).toBe(false);
  });
  test("wrong answer: what was off is listed, nothing is saved as done", async () => {
    k.kontrollSvar = { ok: false, meddelanden: ["På rad 1 av utskriften skrev du `25000`, men vi ville ha `26000`."], utdata: "25000\n", fel: null };
    const r = renderBlock(OVNING, ctx());
    klicka(r, "Kontrollera");
    await tick();
    expect(r.querySelector("ul.kontroll")?.textContent).toContain("På rad 1");
    expect(r.querySelector("pre.utdata")?.textContent).toBe("25000\n");
    expect(sparat["t-lon"]?.klar).toBeUndefined();
    expect(klarAnrop).toBe(0);
  });
  test("a program error while checking is explained, not rated", async () => {
    k.kontrollSvar = { ok: false, meddelanden: [], utdata: "", fel: { typ: "ZeroDivisionError", meddelande: "division by zero", rad: 2 } };
    const r = renderBlock(OVNING, ctx());
    klicka(r, "Kontrollera");
    await tick();
    expect(r.querySelector(".fel-ruta")?.textContent).toContain("Division med noll");
  });
  test("hints come one at a time, three in all", () => {
    const r = renderBlock(OVNING, ctx());
    expect(r.querySelectorAll("ol.ledtradar li")).toHaveLength(0);
    klicka(r, "Ledtråd (1 av 3)");
    expect([...r.querySelectorAll("ol.ledtradar li")].map((l) => l.textContent)).toEqual(["Knuff"]);
    klicka(r, "Ledtråd (2 av 3)");
    klicka(r, "Ledtråd (3 av 3)");
    expect(r.querySelectorAll("ol.ledtradar li")).toHaveLength(3);
    const knapp = [...r.querySelectorAll("button")].find((b) => b.textContent === "Inga fler ledtrådar") as HTMLButtonElement;
    expect(knapp.disabled).toBe(true);
  });
  test("the facit needs two clicks and is then shown", () => {
    const r = renderBlock(OVNING, ctx());
    expect((r.querySelector(".facit") as HTMLElement).hidden).toBe(true);
    klicka(r, "Visa facit");
    expect((r.querySelector(".facit") as HTMLElement).hidden).toBe(true);
    klicka(r, "Är du säker");
    expect((r.querySelector(".facit") as HTMLElement).hidden).toBe(false);
    expect(r.querySelector(".facit code")?.textContent).toBe("print(26000)");
  });
  test("Börja om puts the start code back", () => {
    const r = renderBlock(OVNING, ctx());
    const t = r.querySelector("textarea") as HTMLTextAreaElement;
    t.value = "krafs";
    klicka(r, "Börja om");
    expect(t.value).toBe("# skriv här");
  });
});

describe("text and ruta", () => {
  test("markdown is rendered and a ruta has its heading", () => {
    const t = renderBlock({ typ: "text", markdown: "En **fet** rad." }, ctx());
    expect(t.innerHTML).toContain("<strong>fet</strong>");
    const ruta = renderBlock({ typ: "ruta", rubrik: "Det här kan du från förut", markdown: "Excel." }, ctx());
    expect(ruta.querySelector("h3")?.textContent).toBe("Det här kan du från förut");
  });
});

vi.useRealTimers();
