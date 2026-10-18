// Builds web/src/generated/kurs.json from content/modul-N/ (modul.yml + NN-namn.md). Run by `npm run content`, which
// `npm run build`, `typecheck` and `test` start first. An invalid lesson stops it with file and line.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Kurs, Modul } from "../web/src/kurs-typer.ts";
import { ContentError, kontrolleraKurs, parseLektion, parseModul } from "./lib/innehall.ts";

const ROOT = join(import.meta.dirname, "..");
const CONTENT = join(ROOT, "content");
const OUT = join(ROOT, "web", "src", "generated", "kurs.json");

export function byggKurs(contentDir = CONTENT): Kurs {
  const moduler: Modul[] = [];
  const dirs = readdirSync(contentDir).filter((d) => /^modul-\d+$/.test(d)).sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)));
  for (const dir of dirs) {
    const id = Number(dir.slice(6));
    const base = parseModul(readFileSync(join(contentDir, dir, "modul.yml"), "utf8"), `content/${dir}/modul.yml`, id);
    const files = readdirSync(join(contentDir, dir)).filter((f) => /^\d+-[a-z0-9-]+\.md$/.test(f)).sort();
    const lektioner = files.map((f) => {
      const [, nr, slug] = /^(\d+)-([a-z0-9-]+)\.md$/.exec(f) as RegExpExecArray;
      return parseLektion(readFileSync(join(contentDir, dir, f), "utf8"), `content/${dir}/${f}`, id, Number(nr), slug as string);
    });
    moduler.push({ ...base, lektioner });
  }
  kontrolleraKurs(moduler);
  return { moduler };
}

if (process.argv[1] === import.meta.filename) {
  try {
    const kurs = byggKurs();
    mkdirSync(join(ROOT, "web", "src", "generated"), { recursive: true });
    writeFileSync(OUT, JSON.stringify(kurs));
    const lektioner = kurs.moduler.flatMap((m) => m.lektioner);
    const ovningar = lektioner.flatMap((l) => l.block).filter((b) => b.typ === "ovning" || b.typ === "forutsag").length;
    console.log(`content: ${kurs.moduler.length} moduler, ${lektioner.length} lektioner, ${ovningar} övningar och förutsägelser`);
  } catch (err) {
    console.error(err instanceof ContentError || err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
