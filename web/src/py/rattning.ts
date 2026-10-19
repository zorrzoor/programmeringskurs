// Comparing what a program printed with what an exercise wants, and kind Swedish feedback (docs/koncept.md §2, §7):
// say what was almost right and where to look, never only "wrong". Pure functions: no Pyodide here.

/** Output compared the forgiving way: line endings, spaces at the end of lines and blank lines at the end do not count. */
export function normalisera(utdata: string, ignoreraVersaler: boolean): string[] {
  const rader = utdata.replace(/\r\n/g, "\n").split("\n").map((r) => r.replace(/\s+$/, ""));
  while (rader.length > 0 && rader[rader.length - 1] === "") rader.pop();
  return ignoreraVersaler ? rader.map((r) => r.toLocaleLowerCase("sv")) : rader;
}

const visa = (r: string) => (r === "" ? "(en tom rad)" : `\`${r}\``);

/**
 * When two lines differ in one simple way, say exactly which way (a missing full stop, a comma instead of a point,
 * upper/lower case, spaces), without accepting them: the rating stays strict, the message is what helps.
 */
export function skillnad(rad: number, skrev: string, ville: string, vad: string): string | null {
  const s = `du skrev ${visa(skrev)}, vi ville ha ${visa(ville)}`;
  if (skrev !== ville && skrev.toLocaleLowerCase("sv") === ville.toLocaleLowerCase("sv")) return `På ${vad} ${rad} skiljer det bara på stora och små bokstäver: ${s}`;
  if (skrev.replace(/,/g, ".") === ville && /\d,\d/.test(skrev)) return `På ${vad} ${rad} står ett komma i ett decimaltal. Decimaltal skrivs med punkt, inte komma: ${s}`;
  const sist = /[.!?,:;]$/;
  if (ville.startsWith(skrev) && ville.length === skrev.length + 1 && sist.test(ville)) return `På ${vad} ${rad} saknas ett ${ville.slice(-1)} sist: ${s}`;
  if (skrev.startsWith(ville) && skrev.length === ville.length + 1 && sist.test(skrev)) return `På ${vad} ${rad} har du ett ${skrev.slice(-1)} för mycket sist: ${s}`;
  if (skrev.replace(/\s+/g, " ") === ville.replace(/\s+/g, " ")) return `På ${vad} ${rad} skiljer antalet mellanslag: ${s}`;
  return null;
}

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
    const i = forstaAvvikelse.i;
    messages.push(skillnad(i + 1, a[i] as string, f[i] as string, "rad") ?? `På rad ${i + 1} av utskriften skrev du ${visa(a[i] as string)}, men vi ville ha ${visa(f[i] as string)}`);
  } else if (a.length > f.length) {
    messages.push(`Du har en extra rad i slutet: ${visa(a[f.length] as string)}`);
  } else {
    messages.push(`Det saknar en rad i slutet: vi ville ha ${visa(f[a.length] as string)}`);
  }
  return messages;
}

/** What the task asked for in the code that the code does not do (the names are the `krav` of an exercise). */
export function kravMeddelande(krav: string): string {
  const [vad, namn] = krav.split(":");
  switch (vad) {
    case "uträkning": return "Uppgiften ber om en uträkning, men koden räknar inte ut något (till exempel `20 + 5`) utan skriver bara ut ett färdigt värde.";
    case "kommentar-först": return "Uppgiften ber om en kommentar på första raden, men första raden i koden börjar inte med `#`.";
    case "kommentar": return "Uppgiften ber om en kommentar, men koden har ingen rad med `#`.";
    case "f-sträng": return "Uppgiften ber om en f-sträng, men koden använder ingen (en text med ett `f` framför första citattecknet).";
    case "for": return "Uppgiften ber om en for-loop, men koden har ingen.";
    case "while": return "Uppgiften ber om en while-loop, men koden har ingen.";
    case "loop": return "Uppgiften ber om en loop, men koden har ingen (`for` eller `while`).";
    case "and": return "Uppgiften ber dig använda `and`, men koden gör inte det.";
    case "or": return "Uppgiften ber dig använda `or`, men koden gör inte det.";
    case "funktion": return "Uppgiften ber om en funktion, men koden har ingen `def`.";
    case "import": return `Uppgiften ber dig använda modulen \`${namn}\`, men koden hämtar den inte med \`import ${namn}\`.`;
    case "anropa": return `Uppgiften ber dig använda \`${namn}\`, men koden anropar den inte.`;
    case "inte-anropa": return `Uppgiften ber dig lösa det utan \`${namn}\`, men koden använder den.`;
    default: return `Uppgiften har ett krav (${krav}) som koden inte uppfyller.`;
  }
}

export const jamforVariabel = (namn: string, svar: { finns: boolean; lika: boolean; faktisk: string }, forvantat: unknown): string[] => {
  if (!svar.finns) return [`Variabeln \`${namn}\` finns inte. Har du stavat den rätt, och skapat den i ditt program?`];
  if (svar.lika) return [];
  const hint = typeof forvantat === "number" && /^\(\d+, \d+\)$/.test(svar.faktisk) ? ["Det ser ut som du skrev ett komma i ett decimaltal. Decimaltal skrivs med punkt, inte komma."] : [];
  return [`\`${namn}\` har värdet \`${svar.faktisk}\`, men det ska vara \`${JSON.stringify(forvantat)}\`.`, ...hint];
};

/** Messages for a file that the program should have written; an empty list when its content matches. */
export function jamforFil(namn: string, svar: { finns: boolean; text: string }, forvantat: string): string[] {
  if (!svar.finns) return [`Filen \`${namn}\` finns inte. Har du skrivit den med \`open("${namn}", "w")\`?`];
  const a = normalisera(svar.text, false);
  const f = normalisera(forvantat, false);
  if (a.length === f.length && a.every((r, i) => r === f[i])) return [];
  if (a.length === 0) return [`Filen \`${namn}\` är tom. Skrev du något till den?`];
  const messages: string[] = [];
  if (a.length !== f.length) messages.push(`Filen \`${namn}\` har ${a.length} ${a.length === 1 ? "rad" : "rader"}, men vi väntade oss ${f.length}.`);
  const i = a.findIndex((r, k) => r !== f[k]);
  if (i >= 0 && i < f.length) messages.push(skillnad(i + 1, a[i] as string, f[i] as string, "rad i filen") ?? `På rad ${i + 1} i filen står ${visa(a[i] as string)}, men vi ville ha ${visa(f[i] as string)}`);
  else if (a.length > f.length) messages.push(`Filen har en extra rad i slutet: ${visa(a[f.length] as string)}`);
  else messages.push(`Filen saknar en rad i slutet: vi ville ha ${visa(f[a.length] as string)}`);
  return messages;
}
