import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import type { StegResultat } from "../src/py/engine.ts";
import { skapaStegvisare } from "../src/ui/stegvisare.ts";

const KOD = "pris = 20\npris = pris + 5\nprint(pris)";
const RES: StegResultat = {
  steg: [
    { rad: 1, variabler: [], utdata: "", funktion: null },
    { rad: 2, variabler: [["pris", "20"]], utdata: "", funktion: null },
    { rad: 3, variabler: [["pris", "25"]], utdata: "", funktion: null },
    { rad: null, variabler: [["pris", "25"]], utdata: "25\n", funktion: null },
  ],
  fel: null,
  avbruten: false,
};

let stangd: number;
const knapp = (rot: HTMLElement, text: string) => [...rot.querySelectorAll("button")].find((b) => b.textContent?.includes(text)) as HTMLButtonElement;
const nuRad = (rot: HTMLElement) => [...rot.querySelectorAll("ol.stegkod li")].findIndex((li) => li.classList.contains("nu")) + 1;
const variabler = (rot: HTMLElement) => [...rot.querySelectorAll("table.variabler tr")].map((tr) => tr.textContent);

beforeEach(() => {
  stangd = 0;
});
afterEach(() => vi.useRealTimers());

describe("stegvisare", () => {
  test("starts at the first row: the arrow is on row 1 and the first step is announced", () => {
    const s = skapaStegvisare(KOD, RES, () => stangd++);
    expect(nuRad(s.rot)).toBe(1);
    expect(s.rot.querySelector("li.nu .pil")?.textContent).toBe("➜");
    expect(s.rot.querySelector("li.nu")?.getAttribute("aria-current")).toBe("step");
    expect(s.rot.querySelector(".stegstatus")?.textContent).toBe("Steg 1 av 4. Nästa rad som körs: rad 1: pris = 20");
    expect(variabler(s.rot)).toEqual(["Inga variabler än."]);
    expect(knapp(s.rot, "Förra").disabled).toBe(true);
  });

  test("Nästa goes one step at a time; variables change and the change is marked in words", () => {
    const s = skapaStegvisare(KOD, RES, () => stangd++);
    knapp(s.rot, "Nästa").click();
    expect(nuRad(s.rot)).toBe(2);
    expect(variabler(s.rot)).toEqual(["pris20← ändrades"]);
    knapp(s.rot, "Nästa").click();
    expect(variabler(s.rot)).toEqual(["pris25← ändrades"]);
    knapp(s.rot, "Nästa").click();
    expect(variabler(s.rot)).toEqual(["pris25"]); // unchanged: no marker
    expect(s.rot.querySelector("pre.utdata")?.textContent).toBe("25\n");
    expect(s.rot.querySelector(".stegstatus")?.textContent).toContain("Programmet är klart");
    expect(nuRad(s.rot)).toBe(0); // no row is next
    expect(knapp(s.rot, "Nästa").disabled).toBe(true);
  });

  test("Förra and Början go back", () => {
    const s = skapaStegvisare(KOD, RES, () => stangd++);
    s.till(3);
    knapp(s.rot, "Förra").click();
    expect(nuRad(s.rot)).toBe(3);
    knapp(s.rot, "Början").click();
    expect(nuRad(s.rot)).toBe(1);
  });

  test("Spela steps on its own every moment and stops at the end; Pausa stops it", () => {
    vi.useFakeTimers();
    const s = skapaStegvisare(KOD, RES, () => stangd++);
    knapp(s.rot, "Spela").click();
    expect(knapp(s.rot, "Pausa")).toBeDefined();
    vi.advanceTimersByTime(900);
    expect(nuRad(s.rot)).toBe(2);
    knapp(s.rot, "Pausa").click();
    vi.advanceTimersByTime(5000);
    expect(nuRad(s.rot)).toBe(2);
    knapp(s.rot, "Spela").click();
    vi.advanceTimersByTime(900 * 5);
    expect(s.rot.querySelector(".stegstatus")?.textContent).toContain("Programmet är klart");
    expect(knapp(s.rot, "Spela")).toBeDefined(); // back to Spela when it has ended
  });

  test("Stäng stops the timer and calls back", () => {
    vi.useFakeTimers();
    const s = skapaStegvisare(KOD, RES, () => stangd++);
    knapp(s.rot, "Spela").click();
    knapp(s.rot, "Stäng").click();
    expect(stangd).toBe(1);
    vi.advanceTimersByTime(5000);
    expect(nuRad(s.rot)).toBe(1);
  });

  test("a program that ended with an error shows the explained error at the end", () => {
    const res: StegResultat = { steg: [{ rad: 1, variabler: [], utdata: "", funktion: null }, { rad: null, variabler: [], utdata: "", funktion: null }], fel: { typ: "NameError", meddelande: "name 'y' is not defined", rad: 1 }, avbruten: false };
    const s = skapaStegvisare("print(y)", res, () => stangd++);
    expect(s.rot.querySelector(".fel-ruta")).toBeNull(); // not before the end
    s.till(1);
    expect(s.rot.querySelector(".fel-ruta")?.textContent).toContain("Python känner inte till namnet");
    expect(s.rot.querySelector(".stegstatus")?.textContent).toContain("slutade med ett fel");
  });

  test("too many steps: the first ones are shown with a note", () => {
    const res: StegResultat = { ...RES, avbruten: true };
    const s = skapaStegvisare(KOD, res, () => stangd++);
    s.till(3);
    expect(s.rot.textContent).toContain("fler än 3 steg");
  });

  test("a row inside a function names the function", () => {
    const res: StegResultat = { steg: [{ rad: 2, variabler: [["a", "3"]], utdata: "", funktion: "dubbla" }, { rad: null, variabler: [], utdata: "", funktion: null }], fel: null, avbruten: false };
    const s = skapaStegvisare("def dubbla(a):\n    return a * 2", res, () => stangd++);
    expect(s.rot.querySelector(".stegstatus")?.textContent).toContain("i funktionen dubbla");
  });

  test("the code is shown as text, never as markup", () => {
    const s = skapaStegvisare("print('<img src=x onerror=alert(1)>')", { steg: [{ rad: 1, variabler: [], utdata: "", funktion: null }], fel: null, avbruten: false }, () => stangd++);
    expect(s.rot.querySelector("img")).toBeNull();
  });
});
