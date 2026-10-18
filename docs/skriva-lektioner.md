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

### `forutsag`: gissa innan man kör

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

**Varje facit måste klara sin egen rättning**, och `start` får inte klara den. Det kontrolleras i CI (se #9); ett facit som
inte stämmer stoppar bygget.

### `ruta`: en inramad ruta

För "Det här kan du från förut" (jämförelsen med Office/databaser) och "Fastnat?".

````markdown
```ruta
rubrik: Det här kan du från förut
text: |
  I Excel kan en cell heta *pris*. En variabel i Python är samma sak: ett namn på ett värde.
```
````

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
