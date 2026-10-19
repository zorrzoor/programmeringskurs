import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Accessibility and appearance (#12): axe on every kind of page, in light and dark colours and at every text size,
// no sideways scrolling on a narrow phone, the display settings are kept, and a whole exercise can be done with the
// keyboard alone.
const bas = `Tillg${Date.now().toString(36)}`;
let rakna = 0;

// A new name for every test: the name must be new, and the picker has the same title as the app, so wait for the app.
async function logIn(page: Page): Promise<string> {
  const namn = `${bas}${rakna++}`;
  await page.goto("/");
  await page.locator("#nytt-namn").fill(namn);
  await page.getByRole("button", { name: "Börja" }).click();
  await expect(page.getByText(`Välkommen, ${namn}.`)).toBeVisible();
  return namn;
}

const SIDOR: [string, string][] = [
  ["översikten", "#/"],
  ["en lektion med övning", "#/lektion/m0-din-forsta-rad"],
  ["en lektion med fråga", "#/lektion/m0-vad-gor-en-dator"],
  ["ordlistan", "#/ordlista/variabel"],
  ["jag har fastnat", "#/fastnat"],
];

async function axe(page: Page, vad: string): Promise<void> {
  const r = await new AxeBuilder({ page }).analyze();
  const allvarliga = r.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(allvarliga, `${vad}: ${JSON.stringify(allvarliga.map((v) => [v.id, v.nodes.slice(0, 2).map((n) => n.target)]))}`).toEqual([]);
}

for (const farg of ["light", "dark"] as const) {
  test(`every page passes axe in ${farg} colours, at normal and large text`, async ({ browser }) => {
    test.setTimeout(420_000);
    const ctx = await browser.newContext({ colorScheme: farg, locale: "sv-SE" });
    const page = await ctx.newPage();
    await logIn(page);
    for (const text of ["normal", "storre"] as const) {
      await page.evaluate((t) => { document.documentElement.dataset.text = t; }, text);
      for (const [vad, hash] of SIDOR) {
        await page.evaluate((h) => { location.hash = h; }, hash);
        await page.waitForSelector("main h1");
        await page.waitForTimeout(400);
        await axe(page, `${vad} (${farg}, text ${text})`);
      }
    }
    await ctx.close();
    // the name picker too (a new browser context remembers no name)
    const ctx2 = await browser.newContext({ colorScheme: farg, locale: "sv-SE" });
    const pick = await ctx2.newPage();
    await pick.goto("/");
    await pick.getByRole("heading", { name: "Vem är du?" }).waitFor();
    await axe(pick, `namnvalet (${farg})`);
    await ctx2.close();
  });
}

test("no sideways scrolling on a narrow phone, also with the largest text", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 320, height: 640 }, locale: "sv-SE" });
  const page = await ctx.newPage();
  await logIn(page);
  for (const text of ["normal", "storre"] as const) {
    await page.evaluate((t) => { document.documentElement.dataset.text = t; }, text);
    for (const [vad, hash] of SIDOR) {
      await page.evaluate((h) => { location.hash = h; }, hash);
      await page.waitForSelector("main h1");
      await page.waitForTimeout(300);
      const bredd = await page.evaluate(() => ({
        sida: document.documentElement.scrollWidth,
        fonster: window.innerWidth,
        breda: [...document.querySelectorAll("body *")].filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1).slice(0, 5).map((e) => `${e.tagName}.${e.className}`),
      }));
      expect(bredd.sida, `${vad} (text ${text}) is wider than the screen (${bredd.sida} > ${bredd.fonster}): ${JSON.stringify(bredd.breda)}`).toBeLessThanOrEqual(bredd.fonster + 1);
    }
  }
  await ctx.close();
});

test("the display settings are applied, remembered and respected", async ({ page }) => {
  await logIn(page);
  await page.locator("summary", { hasText: "Visning" }).click();
  await page.getByLabel("Större", { exact: true }).check();
  await page.getByLabel("Mörkt", { exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-text", "storre");
  await expect(page.locator("html")).toHaveAttribute("data-tema", "morkt");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(20, 23, 31)");
  const px = await page.evaluate(() => getComputedStyle(document.documentElement).fontSize);
  expect(parseFloat(px)).toBeGreaterThan(20);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-text", "storre");
  await expect(page.locator("html")).toHaveAttribute("data-tema", "morkt");
});

test("a whole exercise can be done with the keyboard alone", async ({ page }) => {
  await logIn(page);
  await page.evaluate(() => { location.hash = "#/lektion/m0-din-forsta-rad"; });
  await page.waitForSelector("section.block.ovning");
  const ovning = page.locator("section.block.ovning").first();
  // Tab until the focus is in the code box of the exercise. A code box catches Tab (it indents), which is stated under
  // each one: Escape first, and then Tab moves on. A keyboard user does that in the example boxes on the way.
  let i = 0;
  const idag = () => page.evaluate(() => ({ kod: document.activeElement?.classList.contains("cm-content") ?? false, ovning: document.activeElement?.closest("section.block.ovning") !== null }));
  for (; i < 80; i++) {
    const f = await idag();
    if (f.kod && f.ovning) break;
    if (f.kod) await page.keyboard.press("Escape");
    await page.keyboard.press("Tab");
  }
  expect(i, "the code box can be reached with Tab").toBeLessThan(80);
  await page.keyboard.press("Control+A");
  await page.keyboard.insertText('print("Hej!")\nprint("Jag lär mig Python.")\n');
  // Escape, then Tab, leaves the box (stated under each code box); Tab on to the Kontrollera button
  await page.keyboard.press("Escape");
  let j = 0;
  while (j++ < 20 && !(await page.evaluate(() => /Kontrollera/.test(document.activeElement?.textContent ?? "")))) await page.keyboard.press("Tab");
  expect(j, "Kontrollera can be reached with the keyboard").toBeLessThan(20);
  await page.keyboard.press("Enter");
  await expect(ovning.getByText("Rätt!")).toBeVisible();
});

