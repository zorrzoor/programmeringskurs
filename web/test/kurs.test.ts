import { describe, expect, test } from "vitest";
import type { Kurs, Lektion } from "../src/kurs-typer.ts";
import { alla, fortsatt, grannar, hittaLektion, lektionKlar, modulMinuter, totalMinuter, uppgifter, visaTid } from "../src/kurs.ts";
import { lank, tolka } from "../src/router.ts";

const ov = (id: string) => ({ typ: "ovning" as const, id, uppgift: "u", start: "", stdin: [], ratta: { typ: "utdata" as const, forvantat: "1", ignoreraVersaler: false }, ledtradar: ["a", "b", "c"] as [string, string, string], facit: "x" });
const lek = (id: string, modul: number, nr: number, block: Lektion["block"]): Lektion => ({ id, titel: id, mal: "m", modul, nr, minuter: 15, block });
const K: Kurs = {
  ordlista: [],
  fastnat: "",
  moduler: [
    { id: 0, titel: "A", beskrivning: "", kopplas: "", lektioner: [lek("m0-a", 0, 1, [{ typ: "text", markdown: "x" }, ov("o1")]), lek("m0-b", 0, 2, [ov("o2"), ov("o3")])] },
    { id: 1, titel: "B", beskrivning: "", kopplas: "", lektioner: [lek("m1-c", 1, 1, [ov("o4")])] },
  ],
};

describe("kurs", () => {
  test("lessons in order, found by id, with neighbours", () => {
    expect(alla(K).map((l) => l.id)).toEqual(["m0-a", "m0-b", "m1-c"]);
    expect(hittaLektion("m0-b", K)?.nr).toBe(2);
    expect(hittaLektion("saknas", K)).toBeUndefined();
    expect(grannar("m0-b", K)).toMatchObject({ forra: { id: "m0-a" }, nasta: { id: "m1-c" } });
    expect(grannar("m0-a", K).forra).toBeUndefined();
  });
  test("a lesson is done when every task is done, and a lesson without tasks is never done", () => {
    const l = K.moduler[0]?.lektioner[1] as Lektion;
    expect(uppgifter(l)).toHaveLength(2);
    expect(lektionKlar(l, (id) => id === "o2")).toBe(false);
    expect(lektionKlar(l, () => true)).toBe(true);
    expect(lektionKlar(lek("x", 0, 1, [{ typ: "text", markdown: "x" }]), () => true)).toBe(false);
  });
  test("where 'continue' goes", () => {
    const inga = () => false;
    expect(fortsatt(null, inga, K)?.id).toBe("m0-a");
    expect(fortsatt("m0-b", inga, K)?.id).toBe("m0-b"); // the last one, not done
    expect(fortsatt("m0-b", (id) => id === "o1" || id === "o2" || id === "o3", K)?.id).toBe("m1-c"); // done: the first not done
    expect(fortsatt("m0-a", () => true, K)?.id).toBe("m0-a"); // all done: stay where you are
  });
});

describe("time", () => {
  test("module and course totals, and how they are written", () => {
    expect(modulMinuter(K.moduler[0] as never)).toBe(30);
    expect(totalMinuter(K)).toBe(45);
    expect([10, 45, 60, 75, 120, 135].map(visaTid)).toEqual(["ca 10 min", "ca 45 min", "ca 1 h", "ca 1 h 15 min", "ca 2 h", "ca 2 h 15 min"]);
  });
});

describe("router", () => {
  test("routes and links", () => {
    expect(tolka("")).toEqual({ vy: "oversikt" });
    expect(tolka("#/")).toEqual({ vy: "oversikt" });
    expect(tolka("#/lektion/m0-vad-gor-en-dator")).toEqual({ vy: "lektion", id: "m0-vad-gor-en-dator" });
    expect(tolka("#/lektion/../x")).toEqual({ vy: "oversikt" });
    expect(tolka("#/ordlista")).toEqual({ vy: "ordlista" });
    expect(tolka("#/ordlista/f-strang")).toEqual({ vy: "ordlista", id: "f-strang" });
    expect(tolka("#/ordlista/../x")).toEqual({ vy: "oversikt" });
    expect(tolka("#/fastnat")).toEqual({ vy: "fastnat" });
    expect(lank({ vy: "ordlista", id: "kod" })).toBe("#/ordlista/kod");
    expect(lank({ vy: "fastnat" })).toBe("#/fastnat");
    expect(tolka("#/lektion/<script>")).toEqual({ vy: "oversikt" });
    expect(lank({ vy: "lektion", id: "m0-a" })).toBe("#/lektion/m0-a");
    expect(lank({ vy: "oversikt" })).toBe("#/");
  });
});
