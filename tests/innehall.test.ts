import assert from "node:assert/strict";
import { test } from "node:test";
import { ContentError, kontrolleraKurs, parseLektion, parseModul } from "../scripts/lib/innehall.ts";

const FM = "---\ntitel: Testlektion\nmal: Du kan något.\n---\n";
const parse = (body: string) => parseLektion(FM + body, "f.md", 2, 3, "test");
const fails = (body: string, match: RegExp, line?: number) => {
  assert.throws(() => parse(body), (e: Error) => {
    assert.ok(e instanceof ContentError, String(e));
    assert.match(e.message, match);
    if (line !== undefined) assert.match(e.message, new RegExp(`^f\\.md:${line}:`));
    return true;
  });
};

const OVNING = (extra = "") => `\`\`\`ovning
id: t-lon
uppgift: Skriv ut 26000.
start: |
  # skriv här
ratta: {utdata: "26000"}
ledtradar: [a, b, c]
facit: |
  print(26000)
${extra}\`\`\`
`;

test("a lesson becomes text, example, prediction and exercise blocks in order", () => {
  const l = parse(`## Prova

\`\`\`python-exempel
pris = 20
print(pris)
\`\`\`

Förklaring med **fet** text.

\`\`\`forutsag
kod: |
  a = 3
  print(a * 2)
alternativ: ["3", "6", "9"]
ratt: 1
forklaring: Tre gånger två.
\`\`\`

${OVNING()}`);
  assert.equal(l.id, "m2-test");
  assert.deepEqual([l.modul, l.nr, l.titel], [2, 3, "Testlektion"]);
  assert.deepEqual(l.block.map((b) => b.typ), ["text", "exempel", "text", "forutsag", "ovning"]);
  const [, ex, , fo, ov] = l.block;
  assert.deepEqual(ex, { typ: "exempel", kod: "pris = 20\nprint(pris)", stdin: [] });
  assert.equal((fo as { id: string }).id, "m2-test-f1");
  assert.deepEqual((fo as { alternativ: string[] }).alternativ, ["3", "6", "9"]);
  assert.deepEqual((ov as { ratta: unknown }).ratta, { typ: "utdata", forvantat: "26000", ignoreraVersaler: false });
  assert.equal((ov as { start: string }).start, "# skriv här");
});

test("ordinary code fences stay in the text, also fenced with more backticks", () => {
  const l = parse("Text\n\n```python\nprint(1)\n```\n\n````markdown\n```python-exempel\nx\n```\n````\n\n```python-exempel\nprint(2)\n```\n");
  assert.deepEqual(l.block.map((b) => b.typ), ["text", "exempel"]);
  assert.match((l.block[0] as { markdown: string }).markdown, /```python\nprint\(1\)\n```/);
  assert.match((l.block[0] as { markdown: string }).markdown, /````markdown/);
});

test("input() answers for an example", () => {
  const l = parse("```python-exempel\n# stdin: Anna | 7\nnamn = input()\n```\n");
  assert.deepEqual(l.block[0], { typ: "exempel", kod: "namn = input()", stdin: ["Anna", "7"] });
});

test("a prediction about pseudo-code can turn off running", () => {
  const l = parse("```forutsag\nkod: Ta fram 7\nalternativ: [a, b]\nratt: 0\nkor: false\n```\n```forutsag\nkod: print(1)\nsvar: \"1\"\n```\n");
  assert.deepEqual(l.block.map((b) => (b as { kor: boolean }).kor), [false, true]);
  fails("```forutsag\nkod: x\nsvar: y\nkor: kanske\n```\n", /"kor" ska vara/, 6);
});

test("free-text prediction and the three kinds of rating", () => {
  const l = parse(`\`\`\`forutsag
kod: print(1+1)
svar: "2"
\`\`\`

\`\`\`ovning
id: v1
uppgift: u
ratta: {variabler: {lon: 26000, namn: Anna}}
ledtradar: [a, b, c]
facit: lon = 26000
\`\`\`

\`\`\`ovning
id: f1
uppgift: u
ratta: {funktion: dubbla, tester: [{in: [2], ut: 4}, {in: [0], ut: 0}]}
ledtradar: [a, b, c]
facit: |
  def dubbla(x):
      return x * 2
\`\`\`
`);
  assert.equal((l.block[0] as { svar: string }).svar, "2");
  assert.deepEqual((l.block[1] as { ratta: unknown }).ratta, { typ: "variabler", forvantat: { lon: 26000, namn: "Anna" } });
  assert.deepEqual((l.block[2] as { ratta: unknown }).ratta, { typ: "funktion", namn: "dubbla", tester: [{ indata: [2], svar: 4 }, { indata: [0], svar: 0 }] });
});

test("invalid lessons are reported with file and line", () => {
  assert.throws(() => parseLektion("ingen front matter", "f.md", 1, 1, "x"), /f\.md:1: .*front matter/);
  assert.throws(() => parseLektion("---\ntitel: x\n", "f.md", 1, 1, "x"), /avslutande/);
  assert.throws(() => parseLektion("---\ntitel: x\n---\n", "f.md", 1, 1, "x"), /"mal" saknas/);
  fails("Bara text.\n", /inget exempel/);
  fails("Text\n\n```python-exempel\nprint(1)\n", /avslutas aldrig/, 7);
  fails("```ovning\nid: Stor\nuppgift: u\n```\n", /ogiltigt id/, 6);
  fails("```ovning\nid: a\nuppgift: u\nratta: {utdata: \"1\"}\nledtradar: [a, b]\nfacit: x\n```\n", /exakt tre/, 6);
  fails("```ovning\nid: a\nuppgift: u\nratta: {utdata: 1}\nledtradar: [a, b, c]\nfacit: x\n```\n", /ska vara text/, 6);
  fails("```ovning\nid: a\nuppgift: u\nratta: {utdata: \"1\", variabler: {a: 1}}\nledtradar: [a, b, c]\nfacit: x\n```\n", /exakt en/, 6);
  fails("```ovning\nid: a\nuppgift: u\nratta: {utdata: \"1\"}\nledtradar: [a, b, c]\n```\n", /"facit" saknas/, 6);
  fails("```forutsag\nkod: x\nalternativ: [a, b]\nratt: 5\n```\n", /"ratt" ska vara numret/, 6);
  fails("```forutsag\nkod: x\n```\n", /"svar" saknas/, 6);
  fails("```ovning\nid: [oops\n```\n", /ogiltig YAML/, 6);
});

test("module metadata and unique ids across the course", () => {
  assert.deepEqual(parseModul("titel: Mod\nbeskrivning: B\nkopplas: Recept\n", "m.yml", 0), { id: 0, titel: "Mod", beskrivning: "B", kopplas: "Recept" });
  assert.throws(() => parseModul("titel: Mod\n", "m.yml", 0), /"beskrivning"/);
  const l = parse(OVNING());
  const m = { id: 0, titel: "m", beskrivning: "b", kopplas: "", lektioner: [l, { ...l, id: "m2-annan" }] };
  assert.throws(() => kontrolleraKurs([m]), /id "t-lon" finns både i m2-test och i m2-annan/);
  kontrolleraKurs([{ ...m, lektioner: [l] }]);
});
