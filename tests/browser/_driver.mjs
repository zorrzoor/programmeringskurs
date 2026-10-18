// Evaluation driver (not part of the repo): one command per run against the live site, as one learner.
// env: E2E_URL, NAMN, CF_ACCESS_CLIENT_ID, CF_ACCESS_CLIENT_SECRET. Prints what a learner sees.
import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";

const [cmd, ...args] = process.argv.slice(2);
const url = process.env.E2E_URL;
const namn = process.env.NAMN;
const browser = await chromium.launch();
const ctx = await browser.newContext({
  locale: "sv-SE",
  viewport: { width: 1000, height: 900 },
  extraHTTPHeaders: { "CF-Access-Client-Id": process.env.CF_ACCESS_CLIENT_ID, "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET },
});
const page = await ctx.newPage();
page.setDefaultTimeout(90_000);
const sok = (s) => s.replace(/ /g, " ");

async function logIn() {
  await page.goto(url + "/");
  await page.waitForSelector("h1");
  if (await page.getByRole("heading", { name: "Vem är du?" }).isVisible().catch(() => false)) {
    await page.waitForSelector("#nytt-namn"); // the list of names is loaded before the form is drawn
    const knapp = page.locator("button.name", { hasText: new RegExp(`^${namn}$`) });
    if (await knapp.count()) await knapp.click();
    else {
      await page.locator("#nytt-namn").fill(namn);
      await page.getByRole("button", { name: "Börja" }).click();
    }
  }
  await page.getByRole("heading", { name: "Programmeringskurs", level: 1 }).waitFor();
  await page.waitForSelector("main .valkomst");
}
async function lektion(id) {
  for (let forsok = 0; forsok < 3; forsok++) {
    await page.evaluate((h) => { location.hash = h; }, `#/lektion/${id}`);
    try {
      await page.waitForSelector("main h1", { timeout: 20_000 });
      await page.waitForSelector("section.block", { timeout: 20_000 });
      break;
    } catch {
      if (forsok === 2) throw new Error(`lektionen ${id} visades inte; url=${page.url()}; sida: ${(await page.locator("body").innerText().catch(() => "?")).slice(0, 300)}`);
      await logIn();
    }
  }
  await page.waitForTimeout(400);
}
const block = (kind, n) => page.locator(`section.block.${kind}`).nth(Number(n) - 1);

async function visaSida() {
  const delar = await page.evaluate(() => {
    const ut = [];
    const raknare = { exempel: 0, forutsag: 0, ovning: 0 };
    const namn = { exempel: "EXEMPEL", forutsag: "FRÅGA", ovning: "ÖVNING" };
    for (const el of document.querySelectorAll("main > *")) {
      const k = ["exempel", "forutsag", "ovning"].find((c) => el.classList.contains(c));
      if (k) {
        raknare[k] += 1;
        ut.push(`\n[${namn[k]} ${raknare[k]}]\n${el.innerText}`);
      } else ut.push(el.innerText);
    }
    return ut.join("\n");
  });
  console.log(sok(delar));
}
const klartext = async (loc) => sok((await loc.innerText()).replace(/\n{3,}/g, "\n\n"));

await logIn();
if (cmd === "oversikt") {
  console.log(sok(await page.locator("main").innerText()));
} else if (cmd === "lektion") {
  await lektion(args[0]);
  await visaSida();
} else if (cmd === "kor") {
  await lektion(args[0]);
  const b = block("exempel", args[1]);
  await b.getByRole("button", { name: /▶ Kör/ }).click();
  await page.waitForTimeout(1500);
  await b.locator("pre.utdata").waitFor();
  await page.waitForFunction((el) => !el.querySelector("button[disabled]"), await b.elementHandle());
  console.log(await klartext(b.locator("pre.utdata")));
} else if (cmd === "fraga") {
  await lektion(args[0]);
  const b = block("forutsag", args[1]);
  const svar = args.slice(2).join(" ");
  const alt = b.locator("label", { hasText: svar });
  if (await alt.count()) await alt.first().click();
  else await b.locator("input[type=text], textarea").first().fill(svar);
  await b.getByRole("button", { name: "Svara" }).click();
  await page.waitForTimeout(800);
  console.log(await klartext(b));
} else if (cmd === "ovning" || cmd === "kor-ovning") {
  await lektion(args[0]);
  const b = block("ovning", args[1]);
  const kod = readFileSync(args[2], "utf8");
  await b.locator(".cm-content").click();
  await page.keyboard.press("Control+A");
  await page.keyboard.press("Delete");
  await page.keyboard.insertText(kod);
  await b.getByRole("button", { name: cmd === "ovning" ? /Kontrollera/ : /▶ Kör/ }).click();
  await page.waitForTimeout(1500);
  await page.waitForFunction((el) => !el.querySelector("button[disabled]:not(.sekundar)") && !el.querySelector('button[hidden="false"]'), await b.elementHandle()).catch(() => {});
  await page.waitForTimeout(800);
  console.log(await klartext(b.locator("pre.utdata").locator("xpath=..")));
} else if (cmd === "ledtrad") {
  await lektion(args[0]);
  const b = block("ovning", args[1]);
  const k = b.getByRole("button", { name: /Ledtråd/ });
  const antal = Number(args[2] ?? 1);
  for (let i = 0; i < antal; i++) await k.click();
  console.log(await klartext(b.locator("ol.ledtradar")));
} else {
  console.log("okänt kommando");
}
await browser.close();
