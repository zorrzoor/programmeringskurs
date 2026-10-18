# Provkörning med AI-nybörjare (oktober 2026)

Två modeller använde den driftsatta kursen som en nybörjare, genom en riktig webbläsare med ett eget namn per modell
(namnen är borttagna). De fick inte läsa lektionernas källa eller facit. Det är ett komplement till provkörningen med en
riktig nybörjare (#27), inte en ersättning: en modell kan missa det som bara en människa upplever.

| Modell | Uppgift | Resultat |
|---|---|---|
| Opus | Modul 0–2 fullt ut, stickprov i modul 3, 4, 5, 6, 7 och 9, med medvetna nybörjarfel | Betyg 1–5: begriplighet 4, tempo 3, rättning och feedback 3, felmeddelanden 4, motivation 4 |
| Haiku | Modul 0–2, följer lektionerna ordagrant och kan bara det som lärts ut | Alla 16 lektioner och 22 övningar klarades på första försöket, utan ledtrådar och utan att öppna facit |

## Det som fungerar och ska behållas

- De svenska felmeddelandena (rubrik, rad, förklaring, tips).
- Den radvisa jämförelsen av utskrift, och funktionsövningar som rättas med flera anrop.
- Upplägget prova, läs, svara på en fråga, gör själv. Tonen i modul 0–1. Excelrutorna. CSV från svensk Excel.

## Fel som verifierats i källan

| Fel | Var | Status |
|---|---|---|
| Texten säger 15, men `range(1, 5)` ger 10 | m4-summera | åtgärdat |
| "tre rader" ska vara två rader i ett svarsalternativ | m1-print, fråga 1 | åtgärdat |
| Oavgjort mellan Lund och Umeå, bara Lund godkänns | m5-gruppera-poster, övning 2 | åtgärdat |
| Funktion och `return` krävs i modul 5, före modul 6 | m5-gruppera-poster, m5-unika-varden, m5-delar-av-en-lista | åtgärdat |
| Villkorsuttryck (`x if c else y`) som inte lärts ut | m5-gruppera-poster, fråga 1 | åtgärdat |
| Stavfel "ganger", "små:" (saknar ord) | m2-andra-en-variabel, m0-recept-och-instruktioner | åtgärdat |
| Knapplistan saknar Stegvis | m0-sa-fungerar-kursen | åtgärdat |
| Variabel (`frakt = 0`) används före modul 2 | m1-kommentarer | åtgärdat |
| Tidsangivelser för långa/korta lektioner | m0–1 (för höga), m5-gruppera-poster och projekten (för låga) | åtgärdat |

## Förslag som kräver ett beslut eller mer arbete (egna ärenden)

1. **Rättningen är för petig för små saker** (en saknad avslutande punkt, komma mot punkt, skiftläge) och säger inte alltid
   exakt vad som skiljer. Samtidigt godkänns hårdkodad utskrift där uppgiften säger "med en uträkning".
2. ~~**Två felmeddelanden ger fel råd:**~~ åtgärdat: `print(namn = "Anna")` föreslår nu `==`, och text plus tal nämner `int()` för svar från `input()`.
3. **Förväntad utskrift ska visas i kodstil** i uppgiftstexten, så att en punkt i slutet av meningen inte förväxlas med utskriften.
4. **Excelfällor där Excelvana leder fel:** `=` och `<>` mot `==` och `!=`, `^` mot `**`, var `{ }` finns på tangentbordet, hur man gör indrag.
5. **`int(input(...))`** (ett anrop inuti ett annat) förklaras inte i m2-fraga-anvandaren.
6. **Projektet (m9):** steg 3 säger inte att `budget` är ett uppslag, och fel från testanrop visas som rå engelsk TypeError. Stegen bör sättas ihop till ett helt program.
7. ~~**Variabelnamn med å, ä, ö**~~ åtgärdat: lektionen säger nu att övningarna skriver namnen utan å, ä, ö så att rättningen hittar dem.
8. **CSV från svensk Excel** sparas ibland i Windows-1252 (`encoding="cp1252"`), vilket lektionen inte nämner.
9. Kontrollera i en riktig webbläsare att felrutan syns under *exempel* som ger fel (verktyget visade ingen utdata alls för dem).

## Begränsningar i provningen

Verktygets första version kunde inte köra exempel med `input()`, och visade inte felrutor under exempel. Opus
stickprov i modul 3–9 är ytligare än genomgången av modul 0–2. Modellerna uppskattar tid efter eget tempo, inte en
verklig nybörjares.
