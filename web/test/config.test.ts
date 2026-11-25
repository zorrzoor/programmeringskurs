import { afterEach, describe, expect, test } from "vitest";
import { Api } from "../src/api.ts";
import { config, loadConfig, setConfig } from "../src/config.ts";
import { visaOversikt } from "../src/ui/oversikt.ts";

afterEach(() => setConfig({}));

const show = (): string => {
  const root = document.createElement("div");
  visaOversikt(root, "Anna", null, () => false);
  return root.textContent ?? "";
};

describe("instance mode", () => {
  test("the private instance shows the personal greeting", () => {
    setConfig({ lage: "privat" });
    expect(show()).toContain("Älskar dig!");
  });

  test("the public instance does not", () => {
    setConfig({ lage: "publik" });
    expect(show()).not.toContain("Älskar dig!");
    expect(show()).toContain("Välkommen, Anna.");
  });

  test("loadConfig reads the server's mode, and says when it could not (#190)", async () => {
    const ok = await loadConfig(new Api(() => Promise.resolve(new Response(JSON.stringify({ lage: "publik", maxNamn: 2000 }), { headers: { "content-type": "application/json" } }))));
    expect([ok, config()]).toEqual([true, { lage: "publik", maxNamn: 2000, nastaRensning: null, rensaVarje: null }]);
    expect(await loadConfig(new Api(() => Promise.reject(new Error("offline"))))).toBe(false);
    expect(await loadConfig(new Api(() => Promise.resolve(new Response("", { status: 503 }))))).toBe(false);
  });
});
