// Comparing what a program printed with what an exercise wants, and kind Swedish feedback (docs/koncept.md §2, §7):
// say what was almost right and where to look, never only "wrong". Pure functions: no Pyodide here.

/** Output compared the forgiving way: line endings, spaces at the end of lines and blank lines at the end do not count. */
export function normalisera(utdata: string, ignoreraVersaler: boolean): string[] {
  const rader = utdata.replace(/\r\n/g, "\n").split("\n").map((r) => r.replace(/\s+$/, ""));
  while (rader.length > 0 && rader[rader.length - 1] === "") rader.pop();
  return ignoreraVersaler ? rader.map((r) => r.toLocaleLowerCase("sv")) : rader;
}

const visa = (r: string) => (r === "" ? "(en tom rad)" : `\`${r}\``);

/** Messages for output that is not the expected one; an empty list when it matches. */
export function jamforUtdata(faktisk: string, forvantat: string, ignoreraVersaler: boolean): string[] {
  const a = normalisera(faktisk, ignoreraVersaler);
  const f = normalisera(forvantat, ignoreraVersaler);
  if (a.length === f.length && a.every((r, i) => r === f[i])) return [];
  if (a.length === 0) return ["Programmet skrev inte ut något. Glömde du `print(...)`?"];
  const rader = a.map((r, i) => ({ r, i })).find(({ r, i }) => r !== f[i]);
  const forstaAvvikelse = rader ?? { r: "", i: Math.min(a.length, f.length) };
  const messages: string[] = [];
  if (a.length !== f.length) {
    messages.push(`Du skrev ut ${a.length} ${a.length === 1 ? "rad" : "rader"}, men vi väntade oss ${f.length}.`);
  }
  if (forstaAvvikelse.i < a.length && forstaAvvikelse.i < f.length) {
    messages.push(`På rad ${forstaAvvikelse.i + 1} av utskriften skrev du ${visa(a[forstaAvvikelse.i] as string)}, men vi ville ha ${visa(f[forstaAvvikelse.i] as string)}.`);
  } else if (a.length > f.length) {
    messages.push(`Du har en extra rad i slutet: ${visa(a[f.length] as string)}.`);
  } else {
    messages.push(`Det saknar en rad i slutet: vi ville ha ${visa(f[a.length] as string)}.`);
  }
  return messages;
}

export const jamforVariabel = (namn: string, svar: { finns: boolean; lika: boolean; faktisk: string }, forvantat: unknown): string[] => {
  if (!svar.finns) return [`Variabeln \`${namn}\` finns inte. Har du stavat den rätt, och skapat den i ditt program?`];
  if (svar.lika) return [];
  return [`\`${namn}\` har värdet \`${svar.faktisk}\`, men det ska vara \`${JSON.stringify(forvantat)}\`.`];
};
