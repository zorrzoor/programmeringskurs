import { afterEach, beforeEach, describe, expect, test } from "vitest";
import { setConfig } from "../src/config.ts";
import { hamtaKod } from "../src/koder.ts";
import { showPicker } from "../src/ui/picker.ts";
import { FakeApi, MemoryStorage } from "./helpers.ts";

let root: HTMLElement;
let picked: [string, string | undefined][];
let api: FakeApi;

const settle = (ms = 0) => new Promise((r) => setTimeout(r, ms));
const type = (selector: string, value: string, event = false) => {
  const el = root.querySelector(selector) as HTMLInputElement;
  el.value = value;
  if (event) el.dispatchEvent(new Event("input"));
};
const click = (text: string) => {
  const b = [...root.querySelectorAll("button")].find((x) => x.textContent === text);
  if (!b) throw new Error(`no button "${text}" in: ${root.textContent}`);
  b.click();
};
const submit = () => (root.querySelector("form") as HTMLFormElement).dispatchEvent(new Event("submit", { cancelable: true }));

beforeEach(() => {
  Object.defineProperty(globalThis, "localStorage", { value: new MemoryStorage(), configurable: true });
  document.body.innerHTML = '<div id="app"></div>';
  root = document.getElementById("app") as HTMLElement;
  picked = [];
  setConfig({ lage: "publik", maxNamn: 2000 });
  api = new FakeApi(["Anna", "Bosse"]);
  api.publik = true;
  api.codes.set("anna", "KKKKKKKKKKKK");
  api.codes.set("bosse", "MMMMMMMMMMMM");
});
afterEach(() => setConfig({}));

const start = async () => {
  showPicker(root, { api, onPick: (n, k) => picked.push([n, k]) });
  await settle();
};

describe("public name picker", () => {
  test("warns that names are visible and that progress can be cleared", async () => {
    await start();
    expect(root.textContent).toContain("Namnen syns för alla");
    expect(root.textContent).toContain("Framsteg kan rensas vid månadsbyte");
  });

  test("asks for a username, not a real name", async () => {
    await start();
    expect(root.textContent).toContain("inte ditt riktiga namn");
  });

  test("has a privacy text that names Cloudflare, the browser storage and how to get in touch", async () => {
    await start();
    click("Integritet och personuppgifter");
    expect(root.querySelector("h1")?.textContent).toBe("Integritet och personuppgifter");
    expect(root.textContent).toContain("Cloudflare");
    expect(root.textContent).toContain("kurs.koder");
    expect(root.textContent).toContain("Sidan använder inga cookies");
    const links = [...root.querySelectorAll("a")].map((a) => a.getAttribute("href"));
    expect(links).toContain("https://github.com/zorrzoor/programmeringskurs/issues/new");
    click("← Tillbaka");
    expect(root.textContent).toContain("Vem är du?");
  });

  test("searches instead of listing everything", async () => {
    await start();
    expect([...root.querySelectorAll("button.name")].map((b) => b.textContent)).toEqual(["Anna", "Bosse"]);
    type("#sok-namn", "bos", true);
    await settle(300);
    expect(api.calls).toContain("searchNames bos");
    expect([...root.querySelectorAll("button.name")].map((b) => b.textContent)).toEqual(["Bosse"]);
  });

  test("an existing name needs its code, a wrong one is refused", async () => {
    await start();
    click("Anna");
    type("#kod", "AAAA-AAAA-AAAA");
    submit();
    await settle();
    expect(root.textContent).toContain("Koden stämmer inte.");
    expect(picked).toEqual([]);
    type("#kod", "kkkk-kkkk-kkkk");
    submit();
    await settle();
    expect(picked).toEqual([["Anna", "kkkk-kkkk-kkkk"]]);
    expect(hamtaKod("Anna")).toBe("kkkk-kkkk-kkkk");
  });

  test("a remembered code opens the name without typing it", async () => {
    localStorage.setItem("kurs.koder", JSON.stringify({ anna: "KKKK-KKKK-KKKK" }));
    await start();
    click("Anna");
    await settle();
    expect(picked).toEqual([["Anna", "KKKK-KKKK-KKKK"]]);
  });

  test("a remembered code that no longer works is forgotten and asked for again", async () => {
    localStorage.setItem("kurs.koder", JSON.stringify({ anna: "ZZZZ-ZZZZ-ZZZZ" }));
    await start();
    click("Anna");
    await settle();
    expect(picked).toEqual([]);
    expect(hamtaKod("Anna")).toBeNull();
    expect(root.querySelector("#kod")).not.toBeNull();
  });

  test("a new name shows its code once, with a warning that it can not be recovered, and continues only after confirmation", async () => {
    await start();
    type("#nytt-namn", "  Nina   Ny ");
    submit();
    await settle();
    expect(root.querySelector("#din-kod")?.textContent).toBe("ABCD-EFGH-JKMN");
    expect(root.textContent).toContain("går inte att återställa");
    expect(picked).toEqual([]);
    click("Jag har sparat koden");
    expect(picked).toEqual([["Nina Ny", "ABCD-EFGH-JKMN"]]);
    expect(hamtaKod("Nina Ny")).toBe("ABCD-EFGH-JKMN");
  });

  test("removing a name needs the code", async () => {
    await start();
    click("Ta bort ett namn");
    type("#ta-bort-val", "Anna");
    type("#ta-bort-kod", "FEL");
    click("Radera");
    await settle();
    expect(root.textContent).toContain("Koden stämmer inte, så inget har raderats.");
    expect(api.people.has("anna")).toBe(true);
    type("#ta-bort-kod", "KKKK-KKKK-KKKK");
    click("Radera");
    await settle();
    expect(api.people.has("anna")).toBe(false);
  });
});
