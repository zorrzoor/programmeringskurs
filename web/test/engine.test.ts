// @vitest-environment node
// The engine against real Pyodide (the npm package, in Node): the same Python and the same checks as in the browser.
import { loadPyodide } from "pyodide";
import { beforeAll, describe, expect, test } from "vitest";
import type { Ratta } from "../src/kurs-typer.ts";
import { PyEngine, type PyodideLite } from "../src/py/engine.ts";
import { forklaraFel } from "../src/py/felmeddelanden.ts";

let e: PyEngine;
beforeAll(async () => {
  e = new PyEngine((await loadPyodide()) as unknown as PyodideLite);
}, 60_000);

describe("run", () => {
  test("output is collected and streamed", () => {
    const chunks: string[] = [];
    const r = e.run('print("Hej")\nprint(2 + 3)', { onUtdata: (s) => chunks.push(s) });
    expect(r).toEqual({ utdata: "Hej\n5\n", fel: null });
    expect(chunks.join("")).toBe("Hej\n5\n");
  });

  test("each run starts clean: variables do not leak between runs", () => {
    e.run("a = 5");
    expect(e.run("print(a)").fel?.typ).toBe("NameError");
  });

  test("an error carries type, message and row", () => {
    const r = e.run("x = 1\nprint(x)\nprint(y)");
    expect(r.utdata).toBe("1\n");
    expect(r.fel).toEqual({ typ: "NameError", meddelande: "name 'y' is not defined", rad: 3 });
  });

  test("a syntax error has its row", () => {
    const r = e.run('print("a")\nprint("b)');
    expect(r.fel?.typ).toBe("SyntaxError");
    expect(r.fel?.rad).toBe(2);
  });

  test("input() takes the prepared answers, then asks, then gives an EOFError", () => {
    expect(e.run('namn = input("Namn? ")\nprint("Hej", namn)', { stdin: ["Anna"] }).utdata).toBe("Namn? Hej Anna\n");
    expect(e.run("print(input() + input())", { stdin: ["a"], fragaEfter: () => "b" }).utdata).toBe("ab\n");
    expect(e.run("input()").fel?.typ).toBe("EOFError");
  });

  test("too much output stops the program", () => {
    const r = e.run("while True:\n    print('x' * 100)", { grans: 1000 });
    expect(r.fel?.typ).toBe("_ForMycket");
    expect(r.utdata.length).toBeLessThanOrEqual(1000);
  });

  test("the learner cannot break the engine by replacing print or stdout", () => {
    e.run("import sys\nsys.stdout = None\nprint = 5");
    expect(e.run("print('fortfarande')").utdata).toBe("fortfarande\n");
  });
});

describe("real Python errors get a specific Swedish explanation (not the general fallback)", () => {
  const SNIPPETS: [string, string][] = [
    ["print(pris)", "NameError"],
    ['print("Hej)', "SyntaxError"],
    ["print(1", "SyntaxError"],
    ["if 1 == 1\n    print(1)", "SyntaxError"],
    ["if True:\nprint(1)", "IndentationError"],
    ['print("a" + 1)', "TypeError"],
    ["print(1 / 0)", "ZeroDivisionError"],
    ['int("abc")', "ValueError"],
    ["[1, 2][5]", "IndexError"],
    ['{"a": 1}["b"]', "KeyError"],
    ["(1).append(2)", "AttributeError"],
    ["import finnsinte", "ModuleNotFoundError"],
    ["x = 'hej'\nx()", "TypeError"],
    ["def f(a):\n    return a\nf(1, 2)", "TypeError"],
    ["print 'hej'", "SyntaxError"],
  ];
  test.each(SNIPPETS)("%j", (kod, typ) => {
    const fel = e.run(kod).fel;
    expect(fel?.typ).toBe(typ);
    expect(forklaraFel(fel as NonNullable<typeof fel>).rubrik).not.toBe("Programmet stoppades av ett fel");
  });
});

describe("kontrollera", () => {
  test("output: right and wrong, with the learner told where", () => {
    const ratta: Ratta = { typ: "utdata", forvantat: "26000", ignoreraVersaler: false };
    expect(e.kontrollera("lon = 25000\nlon = lon + 1000\nprint(lon)", ratta).ok).toBe(true);
    expect(e.kontrollera("print(26000)", ratta).ok).toBe(true); // behaviour, not the exact code
    const fel = e.kontrollera("print(25000)", ratta);
    expect(fel.ok).toBe(false);
    expect(fel.meddelanden[0]).toContain("På rad 1");
  });

  test("a program that fails is not rated, its error is returned", () => {
    const r = e.kontrollera("print(x)", { typ: "utdata", forvantat: "1", ignoreraVersaler: false });
    expect(r.ok).toBe(false);
    expect(r.fel?.typ).toBe("NameError");
  });

  test("variables, also lists and floats", () => {
    const r = (kod: string) => e.kontrollera(kod, { typ: "variabler", forvantat: { lon: 26000, namn: "Anna", lista: [1, 2, 3], pi: 3.14 } });
    expect(r('lon = 26000\nnamn = "Anna"\nlista = [1, 2, 3]\npi = 3.14').ok).toBe(true);
    expect(r('lon = 26000\nnamn = "Anna"\nlista = (1, 2, 3)\npi = 22/7').meddelanden).toEqual(["`pi` har värdet `3.142857142857143`, men det ska vara `3.14`."]);
    expect(r("lon = 1").meddelanden.join(" ")).toContain("`lon` har värdet `1`");
    expect(r("lon = 26000").meddelanden.join(" ")).toContain("`namn` finns inte");
  });

  test("True is not 1 for a variable check", () => {
    expect(e.kontrollera("ok = 1", { typ: "variabler", forvantat: { ok: true } }).ok).toBe(false);
  });

  test("functions: right, wrong, missing and failing", () => {
    const ratta: Ratta = { typ: "funktion", namn: "dubbla", tester: [{ indata: [2], svar: 4 }, { indata: [0], svar: 0 }] };
    expect(e.kontrollera("def dubbla(x):\n    return x * 2", ratta).ok).toBe(true);
    expect(e.kontrollera("def dubbla(x):\n    return x + 2", ratta).meddelanden).toEqual(["`dubbla(0)` gav `2`, men det ska bli `0`."]);
    expect(e.kontrollera("x = 1", ratta).meddelanden[0]).toContain("`dubbla` finns inte");
    expect(e.kontrollera("def dubbla(x):\n    return x / 0", ratta).meddelanden[0]).toContain("ZeroDivisionError");
  });
});
