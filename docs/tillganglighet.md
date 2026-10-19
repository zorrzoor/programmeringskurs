# Utseende och tillgänglighet

**Omfattning (beslut i #90):** kursen behöver inte anpassas för blinda eller synskadade. Det som krävs är att man kan växla
mellan ljust och mörkt, välja liten, mellan eller stor text, och använda kursen på telefon, surfplatta och dator. De
automatiska kontrollerna för skärmläsare och tangentbord finns kvar eftersom de kostar lite och fångar riktiga fel, men
de är inte ett krav som styr arbetet.

## Vad som är gjort

- **Stor, lugn text:** grundstorlek 18 px, god radavstånd, smal textkolumn. Inga poäng, inga tidsgränser, inget som blinkar
  (rörelse stängs av med `prefers-reduced-motion`).
- **Ljust och mörkt läge** följer enheten, och kan väljas under **Visning** (Som enheten, Ljust, Mörkt).
- **Textstorlek** väljs under **Visning** (Liten, Normal, Stor, Större) och gäller hela sidan. Valen sparas på enheten, inte på
  namnet (de beror på skärmen och ögonen, inte på vem som läser), och faller tillbaka till standard om webbläsaren blockerar lagring.
- **Tangentbord:** hela flödet går att nå. Länken "Hoppa till innehållet" finns först. I en kodruta flyttar Tab in raden, så
  Esc och sedan Tab lämnar rutan (det står under varje ruta).
- **Skärmläsare:** knappar och fält har etiketter, resultat och fel ligger i `status`/`alert`-områden, och utskriftsrutan är en
  namngiven grupp. Sidans språk är svenska.
- **Smal skärm:** inget sidledes rullande ner till 320 px, ens med största textstorleken.
- Knappar och länkar i sidhuvudet är minst 44 px höga.

## Det som testas automatiskt (CI, `tests/browser/tillganglighet.spec.ts`)

1. axe (allvarliga och kritiska fel) på alla sorters sidor, i ljust och mörkt läge och med normal och största text: översikt,
   lektion med övning, lektion med fråga, ordlista, "Jag har fastnat" och namnvalet.
2. Inget sidledes rullande på 320 px bredd, med normal och största text, på alla sidor ovan.
3. Visningsvalen tillämpas (färg och textstorlek), och finns kvar efter omladdning.
4. En hel övning går att göra med enbart tangentbordet: Tab till kodrutan, skriva, Esc, Tab till Kontrollera, Enter.

## Manuell kontroll (görs av en människa vid behov)

Gör den här kontrollen efter större ändringar i utseendet:

1. **Telefon, surfplatta och dator:** öppna kursen på alla tre. Går det att läsa, trycka och skriva kod? Är något avklippt
   eller överlappande, stående och liggande?
2. **Textstorlek:** prova Liten, Normal, Stor och Större under Visning. Är kodrutor, felrutor och ordlistan fortfarande läsbara?
3. **Färger:** prova Som enheten, Ljust och Mörkt. Är kontrasten bra på kvällen (mörkt) och i solljus (ljust)?
