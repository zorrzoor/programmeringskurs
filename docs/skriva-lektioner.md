# Skriva lektioner

Kursen skrivs som Markdown i `content/`. Byggsteget (`npm run content`, som `make build`, `make test` och `make lint` kör
först) läser filerna, kontrollerar dem och skriver `web/src/generated/kurs.json`. Ett ogiltigt block stoppar bygget med
**fil och rad**, till exempel `content/modul-2/03-andra-en-variabel.md:14: ovning t-lon: "ledtradar" ska vara exakt tre texter`.

Läs först [pedagogikreglerna](koncept.md#2-pedagogiska-principer): små steg, prova före förklaring, ett ord i taget,
du-form och korta meningar. Varje PR som ändrar lektioner granskas mot dem.

## Katalogerna

```text
content/
  modul-0/
    modul.yml                    titel, beskrivning, kopplas (vad modulen jämförs med i Office/databaser)
    01-vad-gor-en-dator.md       lektionerna sorteras efter siffran först i filnamnet
    02-vad-ar-ett-program.md
  modul-1/ ...
```

Lektionens id blir `m<modul>-<namn>`, till exempel `m0-vad-gor-en-dator` (det syns i adressen `#/lektion/…`). Filnamnet
får bara ha små bokstäver, siffror och bindestreck.

## Lektionsfilen

````markdown
---
titel: Ändra en variabel
mal: Efter den här lektionen kan du ändra värdet på en variabel.
---

## Prova

Vanlig Markdown: rubriker (`##`), stycken, listor, **fet**, *kursiv*, `kod`, citat och kodblock.
Länkar får gå till kursen (`#/...`) och till https-adresser.
````

Texten renderas av en egen liten renderare utan HTML: skriv aldrig HTML i lektionerna (det visas som text).

## De särskilda blocken

Allt annat än dessa fyra är vanlig Markdown. Blocken skrivs som kodstaket med blockets namn.

### `python-exempel`: ett körbart exempel

Koden visas i en redigerare med **Kör**. Deltagaren får ändra och köra igen. Inget sparas och inget rättas.

````markdown
```python-exempel
pris = 20
pris = pris + 5
print(pris)
```
````

Behöver programmet svar på `input()`, ge dem på första raden: `# stdin: Anna | 7` (skilda av ` | `).

### `forutsag`: en fråga innan man kör (visas som "Fråga")

Fyra skrivsätt, välj ett av de två: **flervalsfråga** (`alternativ` + `ratt`, numret från 0) eller **fritt svar** (`svar`).
Efter svaret får deltagaren köra koden och jämföra. `forklaring` visas efteråt. `id` är valfritt (annars `<lektion>-f<n>`).
Är `kod` låtsaskod som Python inte kan köra (som "Rad 1: ta fram 7"), skriv `kor: false`: då finns ingen "Kör koden"-knapp.
Är `kod` riktig Python kontrollerar bygget att det rätta svaret stämmer med det programmet faktiskt skriver ut.

````markdown
```forutsag
kod: |
  a = 3
  a = a * 2
  print(a)
alternativ: ["3", "6", "9"]
ratt: 1
forklaring: Först 3, sedan 3 * 2 = 6, och det är 6 som lagras och skrivs ut.
```
````

### `ovning`: gör själv

Allt utom `start` och `stdin` är obligatoriskt.

````markdown
```ovning
id: variabler-lon          unikt i hela kursen: små bokstäver, siffror, . _ -
uppgift: Sätt lön till 25000, höj den med 1000 och skriv ut den.
start: |
  # skriv din kod här
ratta: {utdata: "26000"}
ledtradar:                 exakt tre: en knuff, en tydligare, nästan svaret
  - Börja med att skapa variabeln lön.
  - Ändra lön med "lön = lön + ...".
  - Sist ska du skriva ut lön med print.
facit: |
  lön = 25000
  lön = lön + 1000
  print(lön)
```
````

**Rättning** (`ratta`) kontrollerar **beteende**, inte exakt kod. Välj en av tre:

| Skrivsätt | Betyder |
|---|---|
| `{utdata: "26000"}` | det som skrivs ut ska vara 26000 (radslut och blanksteg i slutet av rader ignoreras; `ignorera_versaler: true` ignorerar stora/små bokstäver) |
| `{variabler: {lon: 26000}}` | efter körningen ska variabeln `lon` ha värdet 26000 |
| `{funktion: dubbla, tester: [{in: [2], ut: 4}, {in: [0], ut: 0}]}` | deltagarens funktion `dubbla` anropas med `in` och ska svara `ut` |

`stdin: ["Anna", "7"]` ger svar på `input()` i en övning.

**Rättningen är sträng, men tydlig.** Den förlåter inte en saknad punkt, ett komma i stället för en punkt eller fel skiftläge
(det vore svårt att veta vad som är rätt, och deltagaren ska aldrig undra varför något blev rätt fast det inte ser likadant
ut som önskat resultat). I stället säger meddelandet exakt vad som skiljer: "På rad 1 saknas ett . sist". Undantaget är
`ignorera_versaler: true` på en övning: då godkänns skiftläge, och svaret säger uttryckligen att stora och små bokstäver inte
spelade någon roll.

**`krav`** på en övning kontrollerar *hur* uppgiften löstes, genom att läsa koden (Pythons `ast`), så att `print(70)` inte
godkänns när uppgiften säger "med en uträkning". Använd det när uppgiftstexten ber om ett visst sätt. Kända krav:
`uträkning`, `kommentar-först`, `kommentar`, `f-sträng`, `for`, `while`, `loop` (for eller while), `and`, `or`, `break`, `continue`, `funktion`,
`import:<modul>`, `anropa:<namn>` och `inte-anropa:<namn>`. Facit måste uppfylla sina egna krav (det testas).

````yaml
krav: [for, "anropa:range"]
````

Citerar uppgiftstexten hela den förväntade utskriften i kodstil (till exempel `Skriv ut \`Kalle är 35 år.\``), och utskriften
är flera rader eller slutar med skiljetecken, visar sidan den dessutom som ett block under uppgiften ("Så här ska
utskriften se ut"). Det sker automatiskt och ger aldrig bort svaret, eftersom det redan står i uppgiften. Skriv därför alltid
exakt utskrift i kodstil, och undvik meningar som slutar med ett skiljetecken direkt efter den.

**Varje facit måste klara sin egen rättning**, och `start` får inte klara den. Det kontrolleras i CI (se #9); ett facit som
inte stämmer stoppar bygget.

### `fil`: en fil som lektionen visar

Visas för läsaren (filnamn och innehåll) och läggs i programmets arbetskatalog vid **varje** körning av lektionens exempel,
förutsägelser och övningar, så att koden kan öppna den med `open("forsaljning.csv")`. Katalogen töms före varje körning, så
inget ligger kvar från förra gången. Filnamnet får inte ha katalog eller mellanslag, och samma namn får inte användas två
gånger i en lektion.

````markdown
```fil
namn: forsaljning.csv
innehall: |
  vara,antal,pris
  kaffe,3,30
  te,2,25
```
````

En övning kan kräva att programmet **skriver** en fil, med `ratta: {fil: resultat.txt, innehall: "kaffe: 90\nte: 50"}`. Innehållet
jämförs rad för rad som utskrift (avslutande blanksteg och tomma rader sist räknas inte).

### `ruta`: en inramad ruta

För "Det här kan du från förut" (jämförelsen med Office/databaser) och "Fastnat?".

````markdown
```ruta
rubrik: Det här kan du från förut
text: |
  I Excel kan en cell heta *pris*. En variabel i Python är samma sak: ett namn på ett värde.
```
````

## Ordlistan och "Jag har fastnat"

`content/ordlista.yml` är ordlistan: en lista med `ord`, `forklaring` och eventuellt `former` (andra böjningar som också ska
länka hit, som `variabeln` och `variabler`). Det ska finnas minst 40 ord, och varje ord får finnas en gång.

````yaml
- ord: variabel
  former: [variabeln, variabler, variablerna]
  forklaring: Ett namn på ett värde som programmet kommer ihåg.
````

Bygget länkar **första förekomsten av varje ord i en modul** i löpande text (inte i rubriker, kod, kodblock eller
befintliga länkar) till `#/ordlista/<id>`. Du skriver alltså inga länkar för hand. Länkar du själv skriver till
`#/lektion/<id>` eller `#/ordlista/<id>` kontrolleras av bygget, och en trasig länk stoppar det.

Bygget vet inte vilken betydelse ett ord har, så ett ord kan länkas där det betyder något annat. Länken hoppar över ett
domännamn som `python.org`, och ett ord kan få `ej`: mönster (reguljära uttryck) där ordet **inte** ska länkas. Ordet
markeras med `«` och `»`, och mönstret ser 40 tecken åt varje håll, även kod:

````yaml
- ord: modul
  former: [modulen, moduler]
  ej: ["valfria? «modul»", "«modul» \\d"]   # kursmodul ("modul 5", "en valfri modul"), inte Python-modul
````

Då länkas nästa förekomst i stället, där ordet har ordlistans betydelse. Skriv hellre om meningen om det blir enklare.

`content/fastnat.md` är texten på sidan "Jag har fastnat" (vanlig Markdown, utan rubrik: sidans rubrik sätts av appen).

## Rubriker runt frågor och övningar

Skriv **inte** rubriker som "Fråga", "Ett test", "Din tur" eller "Uppgifter" före ett `forutsag`- eller `ovning`-block: sidan
sätter själv en rubrik, **Test** före frågor och **Övning** före övningar, och bygget tar bort de generiska rubrikerna om du
ändå skrivit dem. Blocken har ingen egen rubrik. Flera frågor eller övningar i rad numreras 1, 2, 3 (en ensam har inget
nummer). Har lektionstexten precis före en egen rubrik, till exempel `## Steg 2: Summan`, används den, och ingen extra
rubrik läggs till.

## En lektions form

Följ ordningen i [kapitel 5](koncept.md#5-så-fungerar-en-lektion): mål, prova, förklaring, förutsäg, gör själv, sammanfattning.
`mal` i front matter är målet i en mening ("Efter den här lektionen kan du …").

## Tid

Varje lektion får en tidsuppskattning ("ca 20 min") som visas i översikten och på lektionssidan; modulerna visar summan.
Bygget räknar ut den för en nybörjare: text läses i 100 ord per minut (när allt är nytt), ett exempel tar 2 minuter att
köra och ändra, en förutsägelse 1,5 minuter och en uppgift 6 minuter (med ledtrådar och ett andra försök). Summan avrundas
uppåt till närmaste 5 minuter, och aldrig under 10.

Vet du att en lektion tar längre eller kortare tid (efter en provkörning, #27), skriv `tid: 25` i front matter (minuter, 5–90).
Ändra hellre uppskattningen i `uppskattaMinuter` om den är fel för alla lektioner.
