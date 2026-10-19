import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// One learner through the real site: pick a name, read, answer, run Python in the worker, get an explained error,
// answer input(), stop a program that never ends, and pick the progress up again on another device.
const namn = `Test${Date.now().toString(36)}`;

async function skrivKod(page: Page, kod: string, index = 0): Promise<void> {
  const editor = page.locator(".cm-content").nth(index);
  await editor.click();
  await page.keyboard.press("Control+A");
  await page.keyboard.type(kod);
}

test.beforeEach(({ page }) => {
  page.on("pageerror", (e) => console.log("PAGE ERROR:", e.message));
  page.on("console", (m) => {
    if (m.type() === "error") console.log("CONSOLE ERROR:", m.text());
  });
});

test("the whole course flow in one browser", async ({ page, browser }) => {
  // Choose a name
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Vem är du?" })).toBeVisible();
  await page.locator("#nytt-namn").fill(namn);
  await page.getByRole("button", { name: "Börja" }).click();
  await expect(page.getByRole("heading", { name: "Programmeringskurs", level: 1 })).toBeVisible();
  await expect(page.getByText(`Välkommen, ${namn}.`)).toBeVisible();

  // The page is cross-origin isolated (needed for input() in the worker)
  expect(await page.evaluate(() => crossOriginIsolated)).toBe(true);

  // Accessibility of the overview
  const oversikt = await new AxeBuilder({ page }).analyze();
  expect(oversikt.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), JSON.stringify(oversikt.violations.map((v) => v.id))).toEqual([]);

  // The glossary and the "I'm stuck" page are one click away
  await page.getByRole("link", { name: "Ordlista" }).click();
  await expect(page.getByRole("heading", { name: "Ordlista", level: 1 })).toBeVisible();
  await expect(page.locator("dt", { hasText: "variabel" }).first()).toBeVisible();
  await page.getByRole("link", { name: "Jag har fastnat" }).click();
  await expect(page.getByRole("heading", { name: "Jag har fastnat", level: 1 })).toBeVisible();
  await page.getByRole("link", { name: "Programmeringskurs", exact: true }).click();

  // Lesson 1: two predictions
  await page.getByRole("link", { name: "Vad gör en dator?", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Vad gör en dator?", level: 1 })).toBeFocused();
  await page.getByLabel("20", { exact: true }).check();
  await page.getByRole("button", { name: "Svara" }).first().click();
  await expect(page.getByText("Rätt!").first()).toBeVisible();
  await page.getByLabel("Datorn kan inte följa instruktionen: den säger inte vad störst betyder").check();
  await page.getByRole("button", { name: "Svara" }).nth(1).click();
  await expect(page.getByText("Du har gjort alla uppgifter i den här lektionen")).toBeVisible();

  const lektion = await new AxeBuilder({ page }).analyze();
  expect(lektion.violations.filter((v) => v.impact === "serious" || v.impact === "critical"), JSON.stringify(lektion.violations.map((v) => v.id))).toEqual([]);

  // Python runs in the worker: an example and an exercise
  await page.goto("/#/lektion/m0-vad-ar-python");
  await page.getByRole("button", { name: "▶ Kör" }).first().click();
  await expect(page.locator("pre.utdata").first()).toHaveText("Hej!\n");
  await skrivKod(page, 'print("Hej, världen!")', 1);
  await page.getByRole("button", { name: "✓ Kontrollera" }).click();
  await expect(page.getByText("Rätt! Bra jobbat.")).toBeVisible();

  // The step-by-step view: step through and watch the variable change
  await page.goto("/#/lektion/m2-andra-en-variabel");
  await page.getByRole("button", { name: "⏭ Stegvis" }).first().click();
  await expect(page.locator(".stegstatus")).toContainText("Steg 1 av 4");
  await page.getByRole("button", { name: "Nästa ▶" }).click();
  await page.getByRole("button", { name: "Nästa ▶" }).click();
  await expect(page.locator("table.variabler")).toContainText("pris");
  await expect(page.locator("table.variabler")).toContainText("25");
  await page.getByRole("button", { name: "Nästa ▶" }).click();
  await expect(page.locator(".stegvisare pre.utdata")).toHaveText("25\n");
  await page.getByRole("button", { name: "✕ Stäng" }).click();
  await expect(page.locator(".stegvisare")).toHaveCount(0);

  // An error is explained in Swedish, with the row and Python's own text
  await page.goto("/#/lektion/m0-sa-fungerar-kursen");
  await page.getByRole("button", { name: "▶ Kör" }).first().click();
  await expect(page.locator(".fel-ruta").first()).toContainText("Python känner inte till namnet");
  await expect(page.locator(".fel-ruta").first()).toContainText("NameError: name 'Hej' is not defined");

  // input(): the program waits, the learner answers, the program goes on
  await page.goto("/#/lektion/m2-fraga-anvandaren");
  await page.getByRole("button", { name: "▶ Kör" }).first().click();
  await expect(page.getByText("Programmet väntar på ett svar:")).toBeVisible();
  await page.locator(".svarsrad input").fill("Anna");
  await page.locator(".svarsrad input").press("Enter");
  await expect(page.locator("pre.utdata").first()).toContainText("Hej Anna!");

  // A program that never ends can be stopped, and the next one runs
  await page.goto("/#/lektion/m1-print");
  await skrivKod(page, "while True: pass", 0);
  await page.getByRole("button", { name: "▶ Kör" }).first().click();
  await page.getByRole("button", { name: "■ Stoppa" }).first().click();
  await expect(page.getByText("Du stoppade programmet.")).toBeVisible();
  await skrivKod(page, 'print("igen")', 0);
  await page.getByRole("button", { name: "▶ Kör" }).first().click();
  await expect(page.locator("pre.utdata").first()).toHaveText("igen\n");

  // ... and one that is not stopped is stopped by the time limit
  await skrivKod(page, "while True: pass", 0);
  await page.getByRole("button", { name: "▶ Kör" }).first().click();
  await expect(page.locator(".fel-ruta").first()).toContainText("Programmet tog för lång tid", { timeout: 30_000 });

  // Progress is on the server: the overview shows lesson 1 as done, also on a device that knows nothing
  await page.goto("/#/");
  await expect(page.locator("li", { hasText: "Vad gör en dator?" }).getByText("✓ klar")).toBeVisible();
  const annan = await browser.newContext();
  const sida = await annan.newPage();
  await sida.goto("/");
  await sida.getByRole("button", { name: namn, exact: true }).click();
  await expect(sida.locator("li", { hasText: "Vad gör en dator?" }).getByText("✓ klar")).toBeVisible();
  // the code written in the exercise came along too
  await sida.goto("/#/lektion/m0-vad-ar-python");
  await expect(sida.locator(".cm-content").nth(1)).toContainText('print("Hej, världen!")');
  await annan.close();

  // Remove the name again (also tests "start over")
  await page.getByRole("button", { name: "Byt namn" }).click();
  await page.getByRole("button", { name: "Ta bort ett namn" }).click();
  await page.locator("#ta-bort-val").selectOption(namn);
  await page.locator("#ta-bort-text").fill(namn);
  await page.getByRole("button", { name: "Radera för alltid" }).click();
  await expect(page.getByRole("button", { name: namn, exact: true })).toHaveCount(0);
});
