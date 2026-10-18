// Python's errors explained in Swedish, calmly (docs/koncept.md §8): an error is information, not a failure. The
// original text from Python is always kept and shown too, so that the learner can recognise it later.
export interface PyFel {
  typ: string;
  meddelande: string;
  rad: number | null;
}

export interface Forklaring {
  rubrik: string;
  forklaring: string;
  tips: string;
}

const q = (s: string) => `\`${s}\``;

interface Regel {
  typ: RegExp;
  meddelande?: RegExp;
  gor: (m: RegExpExecArray | null, fel: PyFel) => { rubrik: string; forklaring: string; tips?: string };
}

const REGLER: Regel[] = [
  {
    typ: /^NameError$/,
    meddelande: /name '(.+)' is not defined/,
    gor: (m) => ({
      rubrik: "Python känner inte till namnet",
      forklaring: `Python hittar inget som heter ${q(m?.[1] ?? "?")}.`,
      tips: "Har du stavat fel? Python skiljer på stora och små bokstäver. Eller har du glömt att skapa variabeln på en rad högre upp? Är det en text ska den stå inom citattecken.",
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /'(.)' was never closed/,
    gor: (m) => ({
      rubrik: "En parentes eller ett tecken stängs aldrig",
      forklaring: `Du har öppnat ${q(m?.[1] ?? "(")} men aldrig stängt det.`,
      tips: "Titta på raden och räkna: varje öppnande parentes ska ha en stängande.",
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /unterminated string literal|unterminated triple-quoted string/,
    gor: () => ({
      rubrik: "En text avslutas aldrig",
      forklaring: "En text ska börja och sluta med samma sorts citattecken, men här saknas det avslutande.",
      tips: 'Skriv till citattecknet på slutet, till exempel print("Hej").',
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /expected ':'/,
    gor: () => ({
      rubrik: "Ett kolon saknas",
      forklaring: `Raden ska sluta med ett kolon (${q(":")}).`,
      tips: "Rader som börjar med if, else, for, while och def slutar alltid med kolon.",
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /unmatched '(.)'/,
    gor: (m) => ({
      rubrik: "Ett stängande tecken har ingen start",
      forklaring: `Det finns en ${q(m?.[1] ?? ")")} utan en motsvarande öppnande parentes.`,
      tips: "Ta bort den extra, eller lägg till parentesen som saknas tidigare på raden.",
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /Perhaps you forgot a comma/,
    gor: () => ({
      rubrik: "Kanske saknas ett komma",
      forklaring: "Python förstår inte raden. Det ser ut som att två saker står bredvid varandra utan komma mellan.",
      tips: 'Om du skriver ut flera saker: print("Summan är", summa) med ett komma mellan.',
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /cannot assign to .* here\. Maybe you meant '==' instead of '='/,
    gor: () => ({
      rubrik: "= och == är olika saker",
      forklaring: `${q("=")} betyder "spara i" medan ${q("==")} betyder "är lika med" (en jämförelse).`,
      tips: "Om du vill jämföra två saker ska du använda dubbla likhetstecken.",
    }),
  },
  {
    typ: /^SyntaxError$/,
    meddelande: /Missing parentheses in call to 'print'/,
    gor: () => ({
      rubrik: "print behöver parenteser",
      forklaring: "I Python skrivs det som ska skrivas ut inom parenteser.",
      tips: 'Skriv print("Hej") i stället för print "Hej".',
    }),
  },
  {
    typ: /^SyntaxError$/,
    gor: (_m, fel) => ({
      rubrik: "Python förstår inte hur raden är skriven",
      forklaring: `Det är ett skrivfel i koden (Python kallar det ${q("SyntaxError")}). Felet ligger oftast på raden Python pekar ut, eller på raden strax innan.`,
      tips: `Läs raden långsamt. Saknas ett citattecken, en parentes eller ett kolon? Pythons egen text: ${fel.meddelande}.`,
    }),
  },
  {
    typ: /^(IndentationError|TabError)$/,
    meddelande: /expected an indented block after '?(\w+)'?/,
    gor: (m) => ({
      rubrik: "Raden efter ska flyttas in",
      forklaring: `Efter ${q(m?.[1] ?? "if")} ska nästa rad ha ett indrag, alltså några mellanslag först.`,
      tips: "Använd fyra mellanslag. Raderna som hör ihop ska ligga lika långt in.",
    }),
  },
  {
    typ: /^(IndentationError|TabError)$/,
    gor: () => ({
      rubrik: "Indraget stämmer inte",
      forklaring: "Raderna börjar inte lika långt in som de borde. I Python betyder indraget vilka rader som hör ihop.",
      tips: "Gör så att rader som hör ihop börjar på exakt samma ställe, och att de som hör till en if eller for är indragna med fyra mellanslag.",
    }),
  },
  {
    typ: /^TypeError$/,
    meddelande: /can only concatenate str \(not "(\w+)"\) to str|unsupported operand type\(s\) for \+: '(\w+)' and '(\w+)'/,
    gor: () => ({
      rubrik: "Text och tal går inte att sätta ihop med +",
      forklaring: `Du försökte lägga ihop en text och ett tal med ${q("+")}. Det är som att försöka lägga ihop ordet "sju" med siffran 7.`,
      tips: "Vill du skriva ut talet i en text: gör om det med str(...), eller skriv en f-sträng: f\"Du är {alder} år\". Vill du räkna med ett svar från input(): gör om svaret till ett tal med int(...) eller float(...).",
    }),
  },
  {
    typ: /^TypeError$/,
    meddelande: /(?:'(\w+)' is an invalid keyword argument for (\w+)\(\)|(\w+)\(\) got an unexpected keyword argument '(\w+)')/,
    gor: (m) => ({
      rubrik: "Ett = där det ska vara ==, eller ett namn som inte finns",
      forklaring: `Inom parentesen till ${q(m?.[2] ?? m?.[3] ?? "funktionen")} står ${q(`${m?.[1] ?? m?.[4] ?? "namn"} = …`)}. Ett enkelt = sparar ett värde, det jämför inte.`,
      tips: `Vill du jämföra två värden ska du skriva ${q("==")}, till exempel ${q('namn == "Anna"')}. Vill du skriva ut en text, sätt den inom citattecken.`,
    }),
  },
  {
    typ: /^TypeError$/,
    meddelande: /(\w+)\(\) takes (\d+) positional arguments? but (\d+) (?:was|were) given/,
    gor: (m) => ({
      rubrik: "Fel antal värden till funktionen",
      forklaring: `Funktionen ${q(m?.[1] ?? "?")} vill ha ${m?.[2]} värde(n) men fick ${m?.[3]}.`,
      tips: "Titta på hur funktionen är skriven (def-raden) och hur du anropar den. Antalet ska vara lika.",
    }),
  },
  {
    typ: /^TypeError$/,
    meddelande: /'(\w+)' object is not callable/,
    gor: (m) => ({
      rubrik: "Du försöker använda något som en funktion",
      forklaring: `Något av typen ${q(m?.[1] ?? "?")} följs av parenteser, som om det vore ett kommando.`,
      tips: "Har du döpt en variabel till samma namn som ett kommando, till exempel print eller sum? Byt namn på variabeln.",
    }),
  },
  {
    typ: /^TypeError$/,
    gor: (_m, fel) => ({
      rubrik: "Typerna passar inte ihop",
      forklaring: "Du försökte göra något med värden av olika sorter som inte går ihop (till exempel text och tal).",
      tips: `Pythons egen text: ${fel.meddelande}. Kolla vad som är text och vad som är tal på raden.`,
    }),
  },
  {
    typ: /^ZeroDivisionError$/,
    gor: () => ({
      rubrik: "Division med noll",
      forklaring: "Du delade med noll. Det går inte, varken på papper eller i Python.",
      tips: "Kolla värdet du delar med: kan det vara 0?",
    }),
  },
  {
    typ: /^ValueError$/,
    meddelande: /invalid literal for int\(\) with base 10: '(.*)'/,
    gor: (m) => ({
      rubrik: "Det går inte att göra texten till ett heltal",
      forklaring: `Texten ${q(m?.[1] ?? "")} ser inte ut som ett heltal, så int() kan inte göra om den.`,
      tips: "int() klarar bara hela tal som 7 eller 42, inga bokstäver och inga decimaler.",
    }),
  },
  {
    typ: /^ValueError$/,
    meddelande: /could not convert string to float: '(.*)'/,
    gor: (m) => ({
      rubrik: "Det går inte att göra texten till ett tal",
      forklaring: `Texten ${q(m?.[1] ?? "")} går inte att göra om till ett decimaltal.`,
      tips: "Använd punkt som decimaltecken (3.5), inte komma.",
    }),
  },
  {
    typ: /^IndexError$/,
    gor: () => ({
      rubrik: "Platsen finns inte i listan",
      forklaring: "Du bad om ett element på en plats som inte finns. Listan är kortare än så.",
      tips: "Platserna räknas från 0: i en lista med tre element är plats 0, 1 och 2 de som finns.",
    }),
  },
  {
    typ: /^KeyError$/,
    gor: (_m, fel) => ({
      rubrik: "Nyckeln finns inte",
      forklaring: `Det finns ingen post som heter ${q(fel.meddelande)} i uppslaget.`,
      tips: "Kolla stavningen, och om nyckeln är en text ska den stå inom citattecken.",
    }),
  },
  {
    typ: /^AttributeError$/,
    gor: (_m, fel) => ({
      rubrik: "Det finns ingen sådan egenskap",
      forklaring: "Du försökte använda en funktion eller egenskap som det här värdet inte har.",
      tips: `Pythons egen text: ${fel.meddelande}. Kolla stavningen, och vilken sorts värde det är.`,
    }),
  },
  {
    typ: /^(ModuleNotFoundError|ImportError)$/,
    gor: (_m, fel) => ({
      rubrik: "Python hittar inte det du vill hämta",
      forklaring: "Raden med import hittar ingen sådan modul.",
      tips: `Kolla stavningen. Pythons egen text: ${fel.meddelande}.`,
    }),
  },
  {
    typ: /^EOFError$/,
    gor: () => ({
      rubrik: "Programmet fick inget svar",
      forklaring: "Programmet bad om ett svar med input(), men det fanns inget svar att ge.",
      tips: "Skriv ditt svar i rutan som visas när programmet väntar, och tryck Skicka.",
    }),
  },
  {
    typ: /^RecursionError$/,
    gor: () => ({
      rubrik: "Funktionen anropar sig själv i all oändlighet",
      forklaring: "En funktion har anropat sig själv om och om igen utan att stanna.",
      tips: "Det måste finnas ett fall där funktionen slutar anropa sig själv.",
    }),
  },
  {
    typ: /^_Timeout$/,
    gor: () => ({
      rubrik: "Programmet tog för lång tid",
      forklaring: "Programmet höll på i över tio sekunder och stoppades, så att sidan inte hänger sig.",
      tips: "Har du en loop som aldrig tar slut? Kontrollera att den har ett villkor som blir sant till slut.",
    }),
  },
  {
    typ: /^_ForMycket$/,
    gor: () => ({
      rubrik: "Programmet skrev ut för mycket",
      forklaring: "Programmet skrev ut väldigt mycket text (över 20 000 tecken) och stoppades.",
      tips: "Har du en loop som aldrig tar slut? Kontrollera att den har ett villkor som blir sant till slut.",
    }),
  },
];

/** Swedish explanation for an error from the engine. Unknown errors get a general one that names the original. */
export function forklaraFel(fel: PyFel): Forklaring {
  for (const regel of REGLER) {
    if (!regel.typ.test(fel.typ)) continue;
    const m = regel.meddelande ? regel.meddelande.exec(fel.meddelande) : null;
    if (regel.meddelande && !m) continue;
    const r = regel.gor(m, fel);
    return { rubrik: r.rubrik, forklaring: r.forklaring, tips: r.tips ?? "" };
  }
  return {
    rubrik: "Programmet stoppades av ett fel",
    forklaring: `Python stoppade programmet med felet ${q(fel.typ)}.`,
    tips: `Pythons egen text: ${fel.meddelande}. Läs den långsamt: den säger oftast vad som är fel, och på vilken rad.`,
  };
}

/** Plain text of the whole explanation (also for tests and a screen reader summary). */
export function felText(fel: PyFel): string {
  const f = forklaraFel(fel);
  return [f.rubrik, fel.rad ? `Rad ${fel.rad}` : "", f.forklaring, f.tips].filter(Boolean).join(". ");
}
