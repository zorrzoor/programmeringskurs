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

describe("stega", () => {
  const vars = (r: ReturnType<PyEngine["stega"]>) => r.steg.map((s) => [s.rad, s.variabler.map(([n, v]) => `${n}=${v}`).join(",")]);
  test("one step per executed row, with the variables as they are before the row, and a last step", () => {
    const r = e.stega("pris = 20\npris = pris + 5\nprint(pris)");
    expect(vars(r)).toEqual([[1, ""], [2, "pris=20"], [3, "pris=25"], [null, "pris=25"]]);
    expect(r.steg[3]?.utdata).toBe("25\n");
    expect(r.steg[2]?.utdata).toBe(""); // output so far, before row 3 ran
    expect(r.fel).toBeNull();
    expect(r.avbruten).toBe(false);
  });
  test("a loop gives a step for every pass over its rows", () => {
    const r = e.stega("total = 0\nfor i in range(3):\n    total = total + i");
    expect(r.steg.filter((s) => s.rad === 3)).toHaveLength(3);
    expect(r.steg.at(-1)?.variabler).toEqual([["total", "3"], ["i", "2"]]);
  });
  test("rows inside a function say which function, with the function's own variables", () => {
    const r = e.stega("def dubbla(a):\n    b = a * 2\n    return b\nprint(dubbla(3))");
    const inne = r.steg.filter((s) => s.funktion === "dubbla");
    expect(inne.map((s) => s.rad)).toEqual([2, 3]);
    expect(inne[1]?.variabler).toEqual([["a", "3"], ["b", "6"]]);
    expect(r.steg.at(-1)?.variabler).toEqual([["dubbla", "<funktion dubbla>"]]);
  });
  test("an error ends the steps and is returned; what ran before is kept", () => {
    const r = e.stega("x = 1\nprint(y)");
    expect(r.fel?.typ).toBe("NameError");
    expect(r.steg.map((s) => s.rad)).toEqual([1, 2, null]);
  });
  test("a program with too many steps is cut off", () => {
    const r = e.stega("while True:\n    pass", { maxSteg: 50 });
    expect(r.avbruten).toBe(true);
    expect(r.steg).toHaveLength(51);
  });
  test("long values are shortened; input() works; tracing is switched off afterwards", () => {
    expect(e.stega("lista = list(range(100))\nx = 1").steg.at(-1)?.variabler[0]?.[1]).toMatch(/\.\.\.$/);
    expect(e.stega("n = input()\nprint(n)", { stdin: ["Anna"] }).steg.at(-1)?.utdata).toBe("Anna\n");
    expect(e.run("print(1)").utdata).toBe("1\n");
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

describe("files", () => {
  const CSV = "namn,belopp\nAnna,100\nBo,250\n";
  test("the program can read a file of the lesson, and every run starts clean", () => {
    const kod = 'import csv\nrader = list(csv.DictReader(open("f.csv", encoding="utf-8")))\nprint(sum(int(r["belopp"]) for r in rader))';
    expect(e.run(kod, { filer: { "f.csv": CSV } })).toEqual({ utdata: "350\n", fel: null });
    // Nothing is left from the earlier run: without the file it is missing again.
    expect(e.run('open("f.csv")').fel?.typ).toBe("FileNotFoundError");
    expect(e.run('open("ny.txt", "w").write("x")').fel).toBeNull();
    expect(e.run('open("ny.txt")').fel?.typ).toBe("FileNotFoundError");
  });

  test("the step-by-step view has the files too", () => {
    expect(e.stega('print(open("f.csv").read().strip())', { filer: { "f.csv": "a,b" } }).steg.at(-1)?.utdata).toBe("a,b\n");
  });

  test("a file the program wrote is rated against the expected content", () => {
    const ratta: Ratta = { typ: "fil", namn: "ut.txt", forvantat: "Anna: 100\nBo: 250" };
    const bra = 'with open("ut.txt", "w") as f:\n    f.write("Anna: 100\\nBo: 250\\n")';
    expect(e.kontrollera(bra, ratta).ok).toBe(true);
    expect(e.kontrollera("print(1)", ratta).meddelanden[0]).toContain("finns inte");
    expect(e.kontrollera('open("ut.txt", "w").write("Anna: 100\\n")', ratta).meddelanden[0]).toContain("1 rad");
  });
});
