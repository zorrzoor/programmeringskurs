import { beforeEach, describe, expect, test, vi } from "vitest";
import { showPicker } from "../src/ui/picker.ts";
import { FakeApi } from "./helpers.ts";

let root: HTMLElement;
let picked: string[];

const settle = () => new Promise((r) => setTimeout(r, 0));
const type = (selector: string, value: string) => {
  (root.querySelector(selector) as HTMLInputElement).value = value;
};
const click = (text: string) => {
  const b = [...root.querySelectorAll("button")].find((x) => x.textContent === text);
  if (!b) throw new Error(`no button "${text}" in: ${root.textContent}`);
  b.click();
};

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>';
  root = document.getElementById("app") as HTMLElement;
  picked = [];
});

describe("name picker", () => {
  test("shows the names and picks one", async () => {
    showPicker(root, { api: new FakeApi(["Anna", "Bosse"]), onPick: (n) => picked.push(n) });
    await settle();
    expect([...root.querySelectorAll("button.name")].map((b) => b.textContent)).toEqual(["Anna", "Bosse"]);
    click("Bosse");
    expect(picked).toEqual(["Bosse"]);
  });

  test("with no names it asks for the first one", async () => {
    showPicker(root, { api: new FakeApi(), onPick: (n) => picked.push(n) });
    await settle();
    expect(root.textContent).toContain("Skriv ditt namn för att börja");
    expect(root.textContent).not.toContain("Ta bort ett namn");
  });

  test("a new name is created and picked, spaces are tidied", async () => {
    const api = new FakeApi(["Anna"]);
    showPicker(root, { api, onPick: (n) => picked.push(n) });
    await settle();
    type("#nytt-namn", "  Märta   Öberg ");
    click("Börja");
    await settle();
    expect(picked).toEqual(["Märta Öberg"]);
    expect(api.people.has("märta öberg")).toBe(true);
  });

  test("an unacceptable name gives help and no request", async () => {
    const api = new FakeApi();
    showPicker(root, { api, onPick: (n) => picked.push(n) });
    await settle();
    type("#nytt-namn", "<b>");
    click("Börja");
    await settle();
    expect(root.querySelector(".message")?.textContent).toContain("1–30 tecken");
    expect(api.calls).not.toContain("createName");
    expect(picked).toEqual([]);
  });

  test("an existing name written differently is explained, not duplicated", async () => {
    showPicker(root, { api: new FakeApi(["Anna"]), onPick: (n) => picked.push(n) });
    await settle();
    type("#nytt-namn", "ANNA");
    click("Börja");
    await settle();
    expect(root.querySelector(".message")?.textContent).toContain("finns redan");
    expect(picked).toEqual([]);
  });

  test("removing a name needs the name typed again", async () => {
    const api = new FakeApi(["Anna", "Bosse"]);
    showPicker(root, { api, onPick: (n) => picked.push(n) });
    await settle();
    click("Ta bort ett namn");
    (root.querySelector("#ta-bort-val") as HTMLSelectElement).value = "Bosse";
    type("#ta-bort-text", "fel");
    click("Radera");
    await settle();
    expect(root.querySelector(".message")?.textContent).toContain("stämmer inte");
    expect(api.people.size).toBe(2);
    type("#ta-bort-text", "bosse");
    click("Radera");
    await settle();
    await settle();
    expect([...api.people.values()].map((p) => p.namn)).toEqual(["Anna"]);
    expect(root.querySelector("h2")?.textContent).toBe("Vem är du?"); // back at the list
  });

  test("cancel leaves everything as it was", async () => {
    const api = new FakeApi(["Anna"]);
    showPicker(root, { api, onPick: (n) => picked.push(n) });
    await settle();
    click("Ta bort ett namn");
    click("Avbryt");
    await settle();
    expect(api.people.size).toBe(1);
    expect(root.querySelector("h2")?.textContent).toBe("Vem är du?");
  });

  test("a server that cannot be reached shows a message and a retry button", async () => {
    const api = new FakeApi(["Anna"]);
    api.offline = true;
    showPicker(root, { api, onPick: (n) => picked.push(n) });
    await settle();
    expect(root.textContent).toContain("Det går inte att nå servern");
    api.offline = false;
    click("Försök igen");
    await settle();
    expect(root.querySelector("button.name")?.textContent).toBe("Anna");
  });

  test("text from a name is shown as text, never as markup", async () => {
    showPicker(root, { api: new FakeApi(["<img src=x onerror=alert(1)>"]), onPick: () => {} });
    await settle();
    expect(root.querySelector("img")).toBeNull();
    expect(root.querySelector("button.name")?.textContent).toBe("<img src=x onerror=alert(1)>");
  });
});

vi.useRealTimers();
