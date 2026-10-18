import { describe, expect, test } from "vitest";
import { felText, forklaraFel, type PyFel } from "../src/py/felmeddelanden.ts";

const fel = (typ: string, meddelande: string, rad: number | null = 3): PyFel => ({ typ, meddelande, rad });

describe("forklaraFel", () => {
  const CASES: [PyFel, RegExp][] = [
    [fel("NameError", "name 'pris' is not defined"), /namnet.*`pris`/s],
    [fel("SyntaxError", "'(' was never closed"), /öppnat `\(`/],
    [fel("SyntaxError", "unterminated string literal (detected at line 1)"), /citattecken/],
    [fel("SyntaxError", "expected ':'"), /kolon/],
    [fel("SyntaxError", "unmatched ')'"), /`\)`/],
    [fel("SyntaxError", "invalid syntax. Perhaps you forgot a comma?"), /komma/],
    [fel("SyntaxError", "Missing parentheses in call to 'print'. Did you mean print(...)?"), /parenteser/],
    [fel("SyntaxError", "invalid syntax"), /skrivfel/],
    [fel("IndentationError", "expected an indented block after 'if' statement on line 2"), /Efter `if`/],
    [fel("IndentationError", "unexpected indent"), /Indraget/],
    [fel("TypeError", 'can only concatenate str (not "int") to str'), /str\(/],
    [fel("TypeError", "unsupported operand type(s) for +: 'int' and 'str'"), /Text och tal/],
    [fel("TypeError", "dubbla() takes 1 positional argument but 2 were given"), /`dubbla` vill ha 1/],
    [fel("TypeError", "'str' object is not callable"), /Du försöker använda/],
    [fel("TypeError", "bad operand type for unary -: 'str'"), /Typerna/],
    [fel("ZeroDivisionError", "division by zero"), /noll/],
    [fel("ValueError", "invalid literal for int() with base 10: 'abc'"), /`abc`/],
    [fel("ValueError", "could not convert string to float: 'x,5'"), /`x,5`/],
    [fel("IndexError", "list index out of range"), /från 0/],
    [fel("KeyError", "'namn'"), /Nyckeln/],
    [fel("AttributeError", "'int' object has no attribute 'append'"), /egenskap/],
    [fel("ModuleNotFoundError", "No module named 'foo'"), /modul/],
    [fel("EOFError", "EOF when reading a line"), /input\(\)/],
    [fel("_ForMycket", ""), /20 000/],
    [fel("_Timeout", ""), /tio sekunder/],
    [fel("RecursionError", "maximum recursion depth exceeded"), /sig själv/],
  ];
  test.each(CASES)("%j", (f, re) => {
    const r = forklaraFel(f);
    expect(`${r.rubrik} ${r.forklaring} ${r.tips}`).toMatch(re);
    expect(r.rubrik).not.toBe("Programmet stoppades av ett fel"); // none of these falls back to the general text
  });

  test("an unknown error gets a general text that names the original", () => {
    const r = forklaraFel(fel("OverflowError", "result too large"));
    expect(r.rubrik).toBe("Programmet stoppades av ett fel");
    expect(r.forklaring).toContain("OverflowError");
    expect(r.tips).toContain("result too large");
  });

  test("felText includes the row", () => {
    expect(felText(fel("ZeroDivisionError", "division by zero", 7))).toContain("Rad 7");
    expect(felText(fel("ZeroDivisionError", "division by zero", null))).not.toContain("Rad");
  });
});
