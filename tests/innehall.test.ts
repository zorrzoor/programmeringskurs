import assert from "node:assert/strict";
import { test } from "node:test";
import { byggKurs } from "../scripts/build-content.ts";
import { ContentError, kontrolleraKurs, lankaOrd, ordId, parseLektion, parseModul, parseOrdlista, uppskattaMinuter, visaForvantadUtskrift } from "../scripts/lib/innehall.ts";

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

test("time estimate: reading, examples, predictions and exercises, rounded up to 5 and never under 10", () => {
  const ord = (n: number) => Array.from({ length: n }, () => "ord").join(" ");
  const text = (n: number) => ({ typ: "text" as const, markdown: ord(n) });
  const ex = { typ: "exempel" as const, kod: "x", stdin: [] };
  const fo = { typ: "forutsag" as const, id: "a", kod: "x", kor: true, stdin: [], alternativ: [], ratt: -1, svar: "1", forklaring: "" };
  const ov = (u: string) => ({ typ: "ovning" as const, id: "b", uppgift: u, start: "", stdin: [], ratta: { typ: "utdata" as const, forvantat: "1", ignoreraVersaler: false }, ledtradar: ["a", "b", "c"] as [string, string, string], facit: "x" });
  assert.equal(uppskattaMinuter([text(50), fo]), 10); // 2 min: the minimum
  assert.equal(uppskattaMinuter([text(200), ex, ex, fo, ov(ord(10)), ov(ord(10))]), 20); // 2 + 4 + 1.5 + 12.2 = 19.7
  assert.equal(uppskattaMinuter([text(1000)]), 10);
  assert.equal(uppskattaMinuter([text(1500)]), 15);
  assert.equal(uppskattaMinuter([text(3000)]), 30);
});

test("a lesson gets its estimate, or the time given in the front matter", () => {
  assert.equal(parse(OVNING()).minuter, 10);
  const l = parseLektion("---\ntitel: T\nmal: M\ntid: 25\n---\n" + OVNING(), "f.md", 2, 3, "t");
  assert.equal(l.minuter, 25);
  for (const bad of ["tid: 3", "tid: 200", "tid: lång"]) {
    assert.throws(() => parseLektion(`---\ntitel: T\nmal: M\n${bad}\n---\n` + OVNING(), "f.md", 2, 3, "t"), /"tid" ska vara minuter/);
  }
});

test("a file block is shown and goes with the code blocks of the lesson", () => {
  const l = parse("```fil\nnamn: f.csv\ninnehall: |\n  a,b\n  1,2\n```\n\n```python-exempel\nprint(1)\n```\n\n```ovning\nid: t-fil\nuppgift: u\nratta: {fil: ut.txt, innehall: \"x\"}\nledtradar: [a, b, c]\nfacit: print(1)\n```\n");
  assert.deepEqual(l.block[0], { typ: "fil", namn: "f.csv", innehall: "a,b\n1,2\n" });
  assert.deepEqual((l.block[1] as { filer: unknown }).filer, { "f.csv": "a,b\n1,2\n" });
  const ov = l.block[2] as { filer: unknown; ratta: unknown };
  assert.deepEqual(ov.filer, { "f.csv": "a,b\n1,2\n" });
  assert.deepEqual(ov.ratta, { typ: "fil", namn: "ut.txt", forvantat: "x" });
});

test("file names are checked", () => {
  fails("```fil\nnamn: ../x.csv\ninnehall: a\n```\n```python-exempel\nx\n```\n", /ogiltigt filnamn/, 6);
  fails("```fil\nnamn: a.csv\ninnehall: a\n```\n```fil\nnamn: a.csv\ninnehall: b\n```\n```python-exempel\nx\n```\n", /två gånger/);
  fails("```ovning\nid: t-a\nuppgift: u\nratta: {fil: a/b.txt, innehall: x}\nledtradar: [a, b, c]\nfacit: x\n```\n", /filnamn utan katalog/);
});

const ORD = parseOrdlista('- ord: variabel\n  former: [variabeln, variabler]\n  forklaring: Ett namn.\n- ord: f-sträng\n  forklaring: Text med klamrar.\n- ord: sträng\n  forklaring: Text.\n- ord: kod\n  forklaring: Instruktioner.\n', "ordlista.yml");

test("the glossary is parsed, with ids without å ä ö", () => {
  assert.deepEqual(ORD.map((o) => o.id), ["variabel", "f-strang", "strang", "kod"]);
  assert.equal(ordId("Jämförelse"), "jamforelse");
  assert.throws(() => parseOrdlista("- ord: kod\n  forklaring: a\n- ord: Kod\n  forklaring: b\n", "o.yml"), /finns redan/);
  assert.throws(() => parseOrdlista("- ord: kod\n", "o.yml"), /forklaring/);
});

test("the first mention of a word is linked, but not in headings, code or existing links", () => {
  const l = parse("## Variabler\n\nEn **variabel** är bra. Variabeln ändras. Se `kod` och [kod](#/lektion/x).\n\n```text\nkod\n```\n\nMer kod här, och en f-sträng och en sträng.\n\n```python-exempel\nx\n```\n");
  lankaOrd(l, ORD);
  const md = (l.block[0] as { markdown: string }).markdown;
  assert.match(md, /^## Variabler/);
  assert.match(md, /\*\*\[variabel\]\(#\/ordlista\/variabel\)\*\* är bra\. Variabeln ändras\./);
  assert.match(md, /`kod` och \[kod\]\(#\/lektion\/x\)/);
  assert.match(md, /```text\nkod\n```/);
  assert.match(md, /Mer \[kod\]\(#\/ordlista\/kod\) här, och en \[f-sträng\]\(#\/ordlista\/f-strang\) och en \[sträng\]\(#\/ordlista\/strang\)\./);
});

test("a word is linked once for all the lessons that share the set", () => {
  const delad = new Set<string>();
  const a = parse("Variabel.\n```python-exempel\nx\n```\n");
  const b = parse("Variabel igen.\n```python-exempel\nx\n```\n");
  lankaOrd(a, ORD, delad);
  lankaOrd(b, ORD, delad);
  assert.match((a.block[0] as { markdown: string }).markdown, /ordlista\/variabel/);
  assert.equal((b.block[0] as { markdown: string }).markdown, "Variabel igen.");
});

test("a link to a lesson or word that does not exist stops the build", () => {
  const l = parse("Se [här](#/lektion/finns-inte).\n```python-exempel\nx\n```\n");
  const m = { id: 2, titel: "t", beskrivning: "b", kopplas: "", lektioner: [l] };
  assert.throws(() => kontrolleraKurs([m], ORD), /#\/lektion\/finns-inte leder ingenstans/);
  const o = parse("Se [här](#/ordlista/saknas).\n```python-exempel\nx\n```\n");
  assert.throws(() => kontrolleraKurs([{ ...m, lektioner: [o] }], ORD), /#\/ordlista\/saknas leder ingenstans/);
});

test("the real glossary has at least 40 words and every link in the course leads somewhere", () => {
  const kurs = byggKurs();
  assert.ok(kurs.ordlista.length >= 40, `${kurs.ordlista.length} ord`);
  assert.ok(kurs.fastnat.length > 100);
  kontrolleraKurs(kurs.moduler, kurs.ordlista);
});

test("the expected output is shown as a block only when the task already quotes it and it is easy to misread", () => {
  const u = (forvantat: string) => ({ typ: "utdata" as const, forvantat, ignoreraVersaler: false });
  assert.equal(visaForvantadUtskrift("Skriv ut `Kalle är 35 år.` med en f-sträng.", u("Kalle är 35 år.")), true);
  assert.equal(visaForvantadUtskrift("Skriv `Ett` och `Två`.", u("Ett\nTvå")), true);
  assert.equal(visaForvantadUtskrift("Skriv ut `Hej`.", u("Hej")), false, "a single word without punctuation needs no block");
  assert.equal(visaForvantadUtskrift("Skriv ut vad `12 * 4 + 3` blir.", u("51")), false, "the answer is not quoted: nothing is given away");
  assert.equal(visaForvantadUtskrift("Skriv ut `a` och sedan svaret.", u("a.\n42")), false);
  assert.equal(visaForvantadUtskrift("Skriv ut `x`.", { typ: "variabler", forvantat: { x: 1 } }), false);
});

test("an exercise whose task quotes its output gets the block", () => {
  const l = parse("```ovning\nid: t-ut\nuppgift: \"Skriv ut `Tack!`.\"\nratta: {utdata: \"Tack!\"}\nledtradar: [a, b, c]\nfacit: print(1)\n```\n");
  assert.equal((l.block[0] as { visaUtskrift?: boolean }).visaUtskrift, true);
  const m = parse("```ovning\nid: t-ut2\nuppgift: \"Skriv ut `Hej`.\"\nratta: {utdata: \"Hej\"}\nledtradar: [a, b, c]\nfacit: print(1)\n```\n");
  assert.equal("visaUtskrift" in (m.block[0] as object), false);
});
