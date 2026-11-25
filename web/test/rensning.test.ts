import { describe, expect, test } from "vitest";
import { dagarKvar, hurOfta, rensningsdag, rensningsText, rensningsVarning } from "../src/rensning.ts";

describe("reset texts (#165)", () => {
  test("the day in Swedish, and how often", () => {
    expect(rensningsdag("2027-01-01")).toBe("1 januari 2027");
    expect(rensningsdag("2027-10-01")).toBe("1 oktober 2027");
    expect([1, 3, 6, 12].map(hurOfta)).toEqual(["varje månad", "varje kvartal", "varje halvår", "en gång om året"]);
  });

  test("the sentence names the reset days of the year and the next one", () => {
    expect(rensningsText("2027-01-01", 3)).toBe(
      "Alla namn och framsteg tas bort varje kvartal (1 januari, 1 april, 1 juli och 1 oktober). Nästa gång: 1 januari 2027.",
    );
    expect(rensningsText("2027-07-01", 6)).toContain("varje halvår (1 januari och 1 juli)");
    expect(rensningsText("2028-01-01", 12)).toContain("en gång om året (1 januari)");
    expect(rensningsText("2027-02-01", 1)).toContain("varje månad (den första varje månad)");
    expect(rensningsText(null, null)).toBe("");
  });

  test("days left are calendar days in the learner's own time", () => {
    expect(dagarKvar("2027-01-01", new Date(2026, 11, 31, 23, 59))).toBe(1);
    expect(dagarKvar("2027-01-01", new Date(2026, 11, 25, 0, 1))).toBe(7);
    expect(dagarKvar(null, new Date())).toBeNull();
  });

  test("a warning only in the last week", () => {
    expect(rensningsVarning("2027-01-01", new Date(2026, 11, 24, 12))).toBeNull();
    expect(rensningsVarning("2027-01-01", new Date(2026, 11, 25, 12))).toContain("om 7 dagar (1 januari 2027)");
    expect(rensningsVarning("2027-01-01", new Date(2026, 11, 31, 12))).toContain("tas bort i natt");
    expect(rensningsVarning(null, new Date())).toBeNull();
  });
});
