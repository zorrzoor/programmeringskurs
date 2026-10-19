# Tillgänglighet och utseende

## Vad som är gjort

- **Stor, lugn text:** grundstorlek 18 px, god radavstånd, smal textkolumn. Inga poäng, inga tidsgränser, inget som blinkar
  (rörelse stängs av med `prefers-reduced-motion`).
- **Ljust och mörkt läge** följer enheten, och kan väljas under **Visning** (Som enheten, Ljust, Mörkt).
- **Textstorlek** väljs under **Visning** (Normal, Stor, Större) och gäller hela sidan. Valen sparas på enheten, inte på
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

## Manuell genomgång (görs av en människa)

Automatiska kontroller hittar inte allt. Gör den här genomgången en gång efter större ändringar, och skriv vad du hittar i ärendet.

1. **Skärmläsare på iPhone (VoiceOver):** slå på VoiceOver (Inställningar, Tillgänglighet), öppna kursen och gå igenom:
   välj namn, öppna en lektion, svara på en fråga, kör ett exempel, gör en övning och läs upp ett felmeddelande. Hörs
   rubriker, knappar, svar ("Rätt!") och fel? Går det att förstå vad man är på?
2. **Tangentbord på dator:** använd bara Tab, Skift+Tab, Enter, mellanslag och Esc. Syns var du är hela tiden (fokusram)?
   Kommer du ur varje kodruta? Går det att göra en hel lektion?
3. **Zoom:** zooma webbläsaren till 200 % och 400 %. Går allt att läsa och använda utan att rulla sidledes?
4. **Textstorlek och färger:** prova alla tre storlekar och alla tre färgval (Visning), på telefon och surfplatta. Är något
   avklippt, överlappande eller svårt att läsa? Läs särskilt kodrutor, felrutor och ordlistan.
5. **Surfplatta, liggande och stående.**
6. **Ögonen:** är kontrasten bra i solljus (ljust läge) och på kvällen (mörkt läge)? Känns det lugnt, utan stress?
