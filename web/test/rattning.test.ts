import { describe, expect, test } from "vitest";
import { jamforFil, jamforUtdata, jamforVariabel, kravMeddelande, normalisera } from "../src/py/rattning.ts";

describe("normalisera", () => {
  test("trailing spaces, line endings and blank lines at the end do not count", () => {
    expect(normalisera("a  \r\nb\n\n\n", false)).toEqual(["a", "b"]);
    expect(normalisera("", false)).toEqual([]);
  });
  test("capitals can be ignored", () => {
    expect(normalisera("Hej Åsa", true)).toEqual(["hej åsa"]);
  });
});

describe("jamforUtdata", () => {
  test("equal output gives no messages", () => {
    expect(jamforUtdata("26000\n", "26000", false)).toEqual([]);
    expect(jamforUtdata("Hej", "hej", true)).toEqual([]);
  });
  test("nothing printed", () => {
    expect(jamforUtdata("", "5", false)[0]).toContain("inte ut något");
  });
  test("a wrong line is pointed out", () => {
    expect(jamforUtdata("5\n", "6", false)).toEqual(["På rad 1 av utskriften skrev du `5`, men vi ville ha `6`"]);
  });
  test("too many and too few lines", () => {
    expect(jamforUtdata("1\n2\n3", "1\n2", false)).toEqual(["Du skrev ut 3 rader, men vi väntade oss 2.", "Du har en extra rad i slutet: `3`"]);
    expect(jamforUtdata("1", "1\n2", false)).toEqual(["Du skrev ut 1 rad, men vi väntade oss 2.", "Det saknar en rad i slutet: vi ville ha `2`"]);
  });
  test("blank lines are shown in words", () => {
    expect(jamforUtdata("a\n\nb", "a\nb", false)[1]).toContain("(en tom rad)");
  });
});

describe("jamforVariabel", () => {
  test("missing, wrong and right", () => {
    expect(jamforVariabel("lon", { finns: false, lika: false, faktisk: "" }, 1)[0]).toContain("finns inte");
    expect(jamforVariabel("lon", { finns: true, lika: false, faktisk: "25000" }, 26000)).toEqual(["`lon` har värdet `25000`, men det ska vara `26000`."]);
    expect(jamforVariabel("lon", { finns: true, lika: true, faktisk: "26000" }, 26000)).toEqual([]);
  });
});

describe("jamforFil", () => {
  test("says what is wrong with a file, and nothing when it matches", () => {
    expect(jamforFil("ut.txt", { finns: true, text: "a\nb\n" }, "a\nb")).toEqual([]);
    expect(jamforFil("ut.txt", { finns: false, text: "" }, "a")[0]).toContain("finns inte");
    expect(jamforFil("ut.txt", { finns: true, text: "" }, "a")[0]).toContain("är tom");
    expect(jamforFil("ut.txt", { finns: true, text: "a\nx\n" }, "a\nb")).toEqual(["På rad 2 i filen står `x`, men vi ville ha `b`"]);
    expect(jamforFil("ut.txt", { finns: true, text: "a\nb\nc\n" }, "a\nb")[1]).toContain("extra rad");
  });
});

describe("skillnad: the rating is strict but says what differs", () => {
  test("each simple difference gets its own message", () => {
    expect(jamforUtdata("Klart", "Klart.", false)[0]).toBe("På rad 1 saknas ett . sist: du skrev `Klart`, vi ville ha `Klart.`");
    expect(jamforUtdata("Klart!!", "Klart!", false)[0]).toContain("för mycket sist");
    expect(jamforUtdata("hej", "Hej", false)[0]).toContain("stora och små bokstäver");
    expect(jamforUtdata("2,5", "2.5", false)[0]).toContain("Decimaltal skrivs med punkt");
    expect(jamforUtdata("a  b", "a b", false)[0]).toContain("antalet mellanslag");
    expect(jamforUtdata("5", "6", false)[0]).toBe("På rad 1 av utskriften skrev du `5`, men vi ville ha `6`");
  });
  test("a comma in a decimal in a variable gets a hint", () => {
    expect(jamforVariabel("pris", { finns: true, lika: false, faktisk: "(12, 5)" }, 12.5)).toHaveLength(2);
    expect(jamforVariabel("pris", { finns: true, lika: false, faktisk: "12" }, 12.5)).toHaveLength(1);
  });
  test("every requirement has a message", () => {
    for (const k of ["uträkning", "kommentar-först", "kommentar", "f-sträng", "for", "while", "loop", "and", "or", "funktion", "import:math", "anropa:len", "inte-anropa:max"]) {
      expect(kravMeddelande(k)).toMatch(/^Uppgiften ber/);
    }
  });
});
