// Removes one name through the app's own "Ta bort ett namn" flow (not part of the repo).
import { chromium } from "@playwright/test";
const namn = process.env.NAMN;
const browser = await chromium.launch();
const ctx = await browser.newContext({ locale: "sv-SE", extraHTTPHeaders: { "CF-Access-Client-Id": process.env.CF_ACCESS_CLIENT_ID, "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET } });
const page = await ctx.newPage();
page.setDefaultTimeout(60_000);
await page.goto(process.env.E2E_URL + "/");
await page.getByRole("heading", { name: "Vem är du?" }).waitFor();
await page.waitForSelector("#nytt-namn");
const finns = async () => (await page.locator("button.name", { hasText: new RegExp(`^${namn}$`) }).count()) > 0;
if (!(await finns())) {
  console.log(`namnet "${namn}" finns inte`);
} else {
  await page.getByRole("button", { name: "Ta bort ett namn" }).click();
  await page.locator("#ta-bort-val").selectOption(namn);
  await page.locator("#ta-bort-text").fill(namn);
  await page.getByRole("button", { name: "Radera för alltid" }).click();
  await page.getByRole("heading", { name: "Vem är du?" }).waitFor();
  await page.waitForSelector("#nytt-namn");
  console.log((await finns()) ? `FEL: "${namn}" finns kvar` : `borttaget: "${namn}"`);
}
await browser.close();
