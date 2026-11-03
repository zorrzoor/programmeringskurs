import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The public instance (KURS_LAGE=publik, scripts/browser-test.sh starts it): a code per name, warnings, no personal greeting.
const url = process.env.E2E_URL_PUBLIK;
test.skip(!url, "no public instance (E2E_URL_PUBLIK)");
test.use({ baseURL: url });

const namn = `Publik${Date.now().toString(36)}`;

test("a name with a code: shown once, remembered on the device, required elsewhere", async ({ page, browser }) => {
  await page.goto("/");
  await expect(page.getByText("Namnen syns för alla")).toBeVisible();
  await expect(page.getByText("Framsteg kan rensas vid månadsbyte")).toBeVisible();

  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);

  await page.locator("#nytt-namn").fill(namn);
  await page.getByRole("button", { name: "Skapa" }).click();
  const kod = (await page.locator("#din-kod").textContent()) ?? "";
  expect(kod).toMatch(/^[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}-[A-HJKMNP-Z2-9]{4}$/);
  await expect(page.getByText("går inte att återställa")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Jag har sparat koden" }).click();

  await expect(page.getByRole("heading", { name: "Programmeringskurs", level: 1 })).toBeVisible();
  await expect(page.getByText(`Välkommen, ${namn}.`)).toBeVisible();
  await expect(page.getByText("Älskar dig!")).toHaveCount(0);

  // The same browser remembers the code.
  await page.reload();
  await expect(page.getByText(`Du är ${namn}`)).toBeVisible();

  // Another device sees the name in the list but needs the code.
  const other = await browser.newContext({ baseURL: url });
  const p2 = await other.newPage();
  await p2.goto("/");
  await p2.locator("#sok-namn").fill(namn.slice(0, 8));
  await p2.getByRole("button", { name: namn, exact: true }).click();
  await p2.locator("#kod").fill("AAAA-AAAA-AAAA");
  await p2.getByRole("button", { name: "Öppna" }).click();
  await expect(p2.getByText("Koden stämmer inte.")).toBeVisible();
  await p2.locator("#kod").fill(kod.toLowerCase());
  await p2.getByRole("button", { name: "Öppna" }).click();
  await expect(p2.getByText(`Välkommen tillbaka, ${namn}.`).or(p2.getByText(`Välkommen, ${namn}.`))).toBeVisible();

  // Removing needs the code too.
  await p2.getByRole("button", { name: "Byt namn" }).click();
  await p2.getByRole("button", { name: "Ta bort ett namn" }).click();
  await p2.locator("#ta-bort-val").fill(namn);
  await p2.locator("#ta-bort-kod").fill("BBBB-BBBB-BBBB");
  await p2.getByRole("button", { name: "Radera" }).click();
  await expect(p2.getByText("Koden stämmer inte, så inget har raderats.")).toBeVisible();
  await p2.locator("#ta-bort-kod").fill(kod);
  await p2.getByRole("button", { name: "Radera" }).click();
  await expect(p2.getByRole("heading", { name: "Vem är du?" })).toBeVisible();
  await other.close();
});
