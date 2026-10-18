# Koncept: programmeringskurs i webbläsaren

Det här dokumentet beskriver hur kursen ska se ut och fungera. Det är underlag för alla ärenden i repot
(översikt: [#1](https://github.com/zorrzoor/programmeringskurs/issues/1)). Det är ett förslag: det som är
osäkert står under [Öppna frågor](#12-öppna-frågor-och-risker).

## Innehåll

1. [Syfte och mål](#1-syfte-och-mål)
2. [Pedagogiska principer](#2-pedagogiska-principer)
3. [Målgrupp](#3-målgrupp)
4. [Så ser det ut: skärmarna](#4-så-ser-det-ut-skärmarna)
5. [Så fungerar en lektion](#5-så-fungerar-en-lektion)
6. [Kursplan](#6-kursplan)
7. [Övningstyper](#7-övningstyper)
8. [Felmeddelanden på svenska](#8-felmeddelanden-på-svenska)
9. [Tekniskt upplägg](#9-tekniskt-upplägg)
10. [Kvalitet och tester](#10-kvalitet-och-tester)
11. [Publicering och drift](#11-publicering-och-drift)
12. [Öppna frågor och risker](#12-öppna-frågor-och-risker)
13. [Arbetsplan](#13-arbetsplan)

## 1. Syfte och mål

Kursen ska ge en vuxen utan IT-bakgrund en trygg start i programmering. Efter kursen ska deltagaren:

- förstå vad ett program är och hur en dator "tänker": den gör en sak i taget, exakt som det står,
- kunna läsa och skriva korta Pythonprogram med variabler, val, upprepningar, listor och funktioner,
- kunna läsa ett felmeddelande utan att bli rädd, och veta vad man gör när man fastnat,
- kunna använda Python på data (en CSV-fil, en tabell) på ett sätt som känns igen från kalkylblad och databaser,
- ha gjort ett eget litet projekt.

Kursen ska **inte** ge en yrkesutbildning. Den ska göra så att nästa steg (en bok, en annan kurs, ett eget
problem) känns möjligt.

Det som är viktigast: det ska vara **roligt och begripligt**. Hellre för lite innehåll som sitter än för mycket som
tröttar ut.

## 2. Pedagogiska principer

Principerna gäller allt som skrivs i kursen och granskas i varje PR som ändrar innehåll.

1. **Små steg.** En lektion handlar om en enda idé och tar 10–20 minuter. Aldrig två nya begrepp samtidigt.
2. **Prova först, förklara sedan.** Varje idé börjar med ett körbart exempel som man ändrar och ser vad som händer.
   Förklaringen kommer efter att man sett det.
3. **Se vad som händer.** Allt som körs kan spelas upp steg för steg, med variablernas värden synliga
   (se [stegvisaren](#43-stegvisaren)).
4. **Känn igen från det man kan.** Nya idéer kopplas till Office och databasprogram: en variabel är som en
   namngiven cell, `if` är som `OM()`, en loop är som "fyll nedåt", en lista är som en kolumn och ett uppslag är
   som en rad i en tabell. Jämförelserna är en bro, inte en sanning: lektionerna säger också var de slutar gälla.
5. **Inget ord utan förklaring.** Facktermer (variabel, sträng, funktion) introduceras en i taget, med en enkel
   förklaring första gången och en länk till ordlistan därefter. Engelska ord som `print` och `if` förklaras som
   "kommandon i Python som råkar vara engelska ord".
6. **Fel är normalt.** Redan i första modulen får man ett felmeddelande med flit, och lär sig att det är en hjälp.
   Ton: "bra, nu fick du ett fel, då kan vi läsa vad datorn säger".
7. **Förutsäg, kör, jämför.** Många övningar ber om en gissning *innan* koden körs. Det är det effektivaste sättet
   att bygga en riktig bild av hur koden fungerar.
8. **Ingen press.** Inga poäng, inga tidsgränser, inga rankingar, inga streaks, inget som blinkar. Framsteg visas
   lugnt som "du har gjort 12 av 38".
9. **Vänlig återkoppling.** Rättningen säger vad som nästan blev rätt och varför ("du skrev 5 men vi ville ha 6, titta
   på raden med `+`"), aldrig bara "fel".
10. **Ledtrådar i tre steg.** Först en knuff, sedan en tydligare ledtråd, sedan nästan svaret. Facit finns alltid
    men visas först efter ett aktivt val.
11. **Repetition med mellanrum.** Varje modul börjar med två–tre små frågor om det som kom för några lektioner sedan.
12. **Skriv så att det går att läsa högt.** Korta meningar, vardagligt språk, du-form, aktiva verb. Inga
    förkortningar utan förklaring.

## 3. Målgrupp

En vuxen som:

- har arbetat med Office (Word, Excel) och databasprogram, och därför kan tänka i celler, formler, tabeller och
  frågor, men som aldrig har skrivit kod,
- är nyfiken men kanske osäker på tekniska saker och lätt tappar sugen om något är krångligt eller om texten
  låter som "IT-språk",
- läser och skriver svenska flytande och inte nödvändigtvis engelska,
- har en vanlig dator eller surfplatta med en modern webbläsare och inget tålamod för installationer.

Konsekvenser: allt är på svenska, ingenting installeras, inget konto behövs, och det går att sluta mitt i en
lektion och komma tillbaka dagen efter.

## 4. Så ser det ut: skärmarna

Skisserna är ASCII och visar upplägg, inte utseende. Utseendet beskrivs i [9.8](#98-utseende-och-tillgänglighet).

### 4.1 Kursöversikten (startsidan)

```text
+----------------------------------------------------------------------------+
|  Programmeringskurs                                  [Ordlista] [Hjälp]    |
+----------------------------------------------------------------------------+
|  Välkommen tillbaka. Du är på lektion 2.3: "Ändra en variabel".            |
|                                                  [ Fortsätt där du var ]   |
|                                                                            |
|  Modul 0  Vad är programmering?                          ●●●●  klar        |
|  Modul 1  Dina första program                            ●●●○  3 av 4      |
|  Modul 2  Variabler: namn på saker                       ●○○○○ 1 av 5      |
|  Modul 3  Val: om och annars                             ○○○○                |
|  Modul 4  Upprepning                                     ○○○○                |
|   ...                                                                       |
|                                                                            |
|  Du har gjort 12 av 38 lektioner.        [ Spara en säkerhetskopia ]       |
+----------------------------------------------------------------------------+
```

### 4.2 Lektionsvyn

Till vänster läser man, till höger provar man. På en smal skärm ligger de under varandra.

```text
+----------------------------------------------------------------------------+
| ← Modul 2 · Lektion 3 av 5                    Förra lektionen | Nästa →     |
+---------------------------------+------------------------------------------+
|  Ändra en variabel              |  1  pris = 20                            |
|                                 |  2  pris = pris + 5                      |
|  En variabel är ett namn som    |  3  print(pris)                          |
|  pekar på ett värde. Det är     |                                          |
|  som en cell i Excel som du     |  [ ▶ Kör ]  [ ⏭ Stegvis ]  [ ↺ Börja om ]|
|  har döpt till "pris".          +------------------------------------------+
|                                 |  Resultat                                |
|  Rad 2 ser ut som en ekvation   |  25                                      |
|  men är ett *kommando*:         |                                          |
|  "ta det som finns i pris,      +------------------------------------------+
|  lägg på 5, och lägg tillbaka   |  Din uppgift                             |
|  det i pris".                   |  Ändra raden så att priset blir 30.      |
|                                 |  [ Ledtråd ]  [ Kontrollera ]            |
+---------------------------------+------------------------------------------+
```

### 4.3 Stegvisaren

Det som gör att man *ser* vad som händer. Samma kod, men en rad i taget.

```text
+----------------------------------------------------------------------------+
|  1  pris = 20                                                              |
|▶ 2  pris = pris + 5      ← datorn är här                                   |
|  3  print(pris)                                                            |
+--------------------------------+-------------------------------------------+
|  Datorns minne                 |  Resultat                                 |
|  pris   20                     |  (inget ännu)                             |
+--------------------------------+-------------------------------------------+
|  Steg 2 av 3   [◀ Bakåt] [▶ Framåt] [▶▶ Spela]  Fart: ●○○                  |
|  Just nu: räkna ut pris + 5 = 25 och lägg det i pris.                      |
+----------------------------------------------------------------------------+
```

Stegvisaren visar i en vanlig mening vad raden gör ("Just nu: …") så att deltagaren inte behöver tolka koden
själv. Variabler som ändrats i det senaste steget markeras.

### 4.4 Fel och rättning

```text
  Något gick snett på rad 2.                                       [Visa felet på engelska]
  Datorn hittade ett namn som den inte känner till: "prise".
  Du har skrivit "prise" men variabeln heter "pris". Kolla stavningen.

  ✔ Nästan! Du fick 25 men uppgiften ville ha 30. Titta på raden med +.
```

### 4.5 Vem är du? (välj namn)

Ingen inloggning och inget lösenord: man väljer ett **namn**, och framsteget sparas på det namnet. Det gör att man kan
fortsätta från en annan dator, surfplatta eller telefon.

```text
+----------------------------------------------------------------------------+
|  Programmeringskurs                                                        |
+----------------------------------------------------------------------------+
|  Vem är du?                                                                |
|                                                                            |
|      [ Anna ]     [ Bosse ]                                                |
|                                                                            |
|  Är du ny? Skriv ditt namn:  [____________]   [ Börja ]                    |
|                                                                            |
|  Fel namn eller vill börja om?   [ Ta bort ett namn ]                      |
+----------------------------------------------------------------------------+
```

- **Första gången på en enhet** visas namnen som finns och en ruta för ett nytt namn. Enheten kommer sedan ihåg det
  senast valda namnet och går direkt till kursen. Byte av namn finns alltid i menyn.
- **Ta bort ett namn** raderar allt framsteg för namnet och kräver att man skriver namnet för att bekräfta. Det är
  det enda sättet att börja om från början, och det går inte att ångra.
- Namn är 1–30 tecken (bokstäver, siffror, mellanslag, bindestreck). Samma namn med annan stavning av versaler räknas som
  samma namn.
- Det finns **inget skydd mellan namnen**: den som kan öppna sidan kan öppna alla namn. Skyddet sitter utanför
  appen (se [kapitel 11](#11-publicering-och-drift)). Det är ett medvetet val för att hålla det enkelt.

## 5. Så fungerar en lektion

En lektion följer alltid samma ordning, så att man vet vad som väntar:

1. **Mål i en mening.** "Efter den här lektionen kan du ändra värdet på en variabel."
2. **Prova.** Ett körbart exempel att köra och ändra.
3. **Förklaring.** Några korta stycken, en jämförelse med Office, ett ord i taget.
4. **Se vad som händer.** Stegvisaren på exemplet.
5. **Förutsäg.** "Vad skrivs ut?" med val eller fritt svar, innan man kör.
6. **Gör själv.** En till tre övningar i stigande svårighet.
7. **Sammanfattning.** Tre punkter: det här lärde du dig. Och en fråga om vad som var svårast (frivillig, sparas bara lokalt).

Varje lektion har en ruta **"Fastnat?"** som länkar till hjälpsidan och en ruta **"Det här kan du från förut"** med
kopplingen till Office eller databaser.

## 6. Kursplan

Ungefär 38 lektioner. Varje modul slutar med en liten sammanfattning och en blandad övning.

**Tid:** varje lektion och modul visar en uppskattning i kursen ("ca 20 min", "ca 2 h"), för en nybörjare som läser, provar och gör uppgifterna. Den räknas ut av bygget (se [skriva-lektioner](skriva-lektioner.md#tid)) och ska kontrolleras mot riktiga deltagare (#27). Hela kursen väntas ta **ungefär 20–25 timmar**, alltså flera veckor med en lektion eller två per tillfälle.

| Modul | Rubrik | Lektioner (urval) | Kopplas till | Tid |
|---|---|---|---|---|
| 0 | Vad är programmering? | Vad en dator gör; vad ett program är; recept och instruktioner; vad Python är; hur kursen fungerar; att köra första raden | Recept, makron | 1 h 20 min (beräknad) |
| 1 | Dina första program | `print`; text och tal; räkna med Python; kommentarer; ditt första felmeddelande | Miniräknaren, Excels formelfält | 2 h (beräknad) |
| 2 | Variabler | Ett namn på ett värde; ändra en variabel; tal och text; sätta ihop text (`f"..."`); fråga användaren (`input`) | Namngivna celler | 1 h 40 min (beräknad) |
| 3 | Val: om och annars | Ja/nej-frågor (jämförelser); `if`; `else`; `elif`; och/eller/inte | `OM()`, filter | 2 h 15 min (beräknad) |
| 4 | Upprepning | `for`; `range`; summera i en loop; `while`; att avbryta | Fyll nedåt, `SUMMA()` | 2 h (beräknad) |
| 5 | Listor och uppslag | Listor; gå igenom en lista; ändra och sortera; uppslag (`dict`); lista av poster | Kolumn, rad i en tabell | 2 h 5 min (beräknad) |
| 6 | Funktioner | Ge kod ett namn; parametrar; `return`; dela upp ett problem; egna små bibliotek | Makron, namngivna formler | 2 h (beräknad) |
| 7 | Data och filer | Läsa en CSV-fil; summera per grupp; filtrera; skriva resultat; ett enkelt diagram | Kalkylblad, pivottabell | ca 2 h 30 min |
| 8 | Databaser med SQL (valfri) | Tabeller; `SELECT` och `WHERE`; `ORDER BY`; `GROUP BY`; `JOIN` | Databasprogram, frågor | ca 2 h (valfri) |
| 9 | Egna projekt | Välj ett av tre: hushållsbudget, frågesport, rapport från en CSV-fil; steg-för-steg-guide och förslag på förbättringar | Allt | ca 3–4 h |

Under hela kursen finns **felsökning** som ett återkommande tema ("läs felet, titta i stegvisaren, förenkla"), och en
**ordlista** som växer.

### Exempel på hur en lektion ser ut i text (modul 2, lektion 3)

> **Mål:** Efter den här lektionen kan du ändra värdet på en variabel.
>
> **Prova:** Kör koden. Ändra 5 till 10 och kör igen.
>
> ```python
> pris = 20
> pris = pris + 5
> print(pris)
> ```
>
> **Det här kan du från förut:** I Excel kan du ha en cell som heter *pris* och skriva `=pris+5`. I Python skriver du
> det som ett kommando, och resultatet *läggs tillbaka* i *pris*. Därför står det bara 25 på slutet, inte 20.
>
> **Förutsäg:** Vad skrivs ut här? `a = 3`, `a = a * 2`, `print(a)` → 3 / 6 / 9?
>
> **Gör själv:** Skriv ett program som sätter `lön = 25000`, höjer den med 1000 och skriver ut den nya lönen.

## 7. Övningstyper

| Typ | Vad deltagaren gör | Rättas genom |
|---|---|---|
| **Förutsäg** | Gissar vad koden skriver ut, kör sedan och jämför | Jämförelse med faktiskt resultat |
| **Rätta felet** | Får kod med ett fel och ska få den att fungera | Utdata eller testfall |
| **Fyll i luckan** | Skriver det som saknas på en markerad plats | Utdata eller testfall |
| **Skriv själv** | Får en uppgift och en tom ruta | Utdata, variabler eller funktionstest |
| **Ordna raderna** | Drar raderna i rätt ordning | Ordningen mot facit |
| **Läs och förklara** | Väljer vilken beskrivning som stämmer med koden | Flervalsfråga |

Alla övningar har: uppgiftstext, startkod, rättning, tre ledtrådar och ett facit. Ett facit som inte klarar sin
egen rättning stoppar bygget (se [kvalitet](#10-kvalitet-och-tester)).

Rättning mot **beteende**, inte mot exakt kod: `print(2+3)` och `summa = 2+3; print(summa)` ska båda godkännas om
uppgiften är "skriv ut 5". Rättningen kan också köra deltagarens funktion mot flera testfall och säga vilket som
inte stämde.

## 8. Felmeddelanden på svenska

Pythons fel är på engelska, skrivna för programmerare. Kursen översätter dem och förklarar dem på svenska:

| Python säger | Kursen säger |
|---|---|
| `NameError: name 'prise' is not defined` | Datorn känner inte till namnet "prise". Är det stavat rätt? Har du skapat variabeln innan du använder den? |
| `SyntaxError: unterminated string literal` | Det saknas ett citattecken. Text måste börja och sluta med citattecken: `"så här"`. |
| `IndentationError` | Raden är indragen fel. Rader som hör ihop ska börja på samma plats. |
| `TypeError: can only concatenate str (not "int") to str` | Du försöker sätta ihop text och tal. Gör om talet till text med `str(...)`, eller använd `f"..."`. |
| `ZeroDivisionError` | Du delar med noll, vilket inte går. |

Det riktiga felet finns alltid kvar bakom en länk, så att man senare känner igen det i andra sammanhang. Listan byggs
tabelldriven och testas (en träff per feltyp, med exempel).

## 9. Tekniskt upplägg

### 9.1 Överblick

En **webbapp med en liten server**. Sidan (HTML, JavaScript och data) levereras av en server som också sparar
framsteg per namn. Ingen inloggning. Python körs i webbläsaren med **Pyodide** (CPython kompilerat till WebAssembly),
så deltagarens kod lämnar aldrig webbläsaren. Servern ser bara namn och framsteg.

```text
 Webbläsaren
 ├── Sidan (Vite + TypeScript)
 │    ├── Lektionsvy, kursöversikt, ordlista, hjälp
 │    ├── Redigerare (CodeMirror 6)
 │    └── Stegvisare, rättning, framsteg
 └── Web Worker
      └── Pyodide (Python)  ← kör deltagarens kod, kan avbrytas
          │
          │ framsteg (namn, klara övningar, egen kod)
          ▼
 Servern (Node.js, en container i k3s-klustret)
 ├── Levererar sidan (statiska filer)
 └── API för namn och framsteg  →  SQLite på en lagringsvolym
```

### 9.2 Python i webbläsaren

- Pyodide körs i en **Web Worker**, så att sidan inte fryser och en oändlig loop kan avbrytas (workern startas om).
- `print` och fel skickas till sidan i realtid. `input()` visar en ruta i sidan.
- Pyodide och dess filer levereras **från samma adress som sidan**, inte från ett externt CDN. Kursen kontaktar inga
  andra servrar när den körs.
- Ett virtuellt filsystem i minnet ger möjlighet att läsa och skriva filer (modul 7), t.ex. de medföljande CSV-filerna.
- Biblioteken som behövs i kursen läggs med i bygget (standardbiblioteket, `sqlite3`, ev. ett litet diagrambibliotek).

### 9.3 Stegvisaren

Bygger på `sys.settrace` i workern: för varje rad som körs sparas radnummer, variabler (kopior) och utdata hittills.
Sidan spelar sedan upp spåret. Gränser på antal steg och storlek skyddar mot långa loopar ("det här programmet har fler
än 500 steg, visa de första"). Samma idé som Python Tutor, men egen och på svenska.

### 9.4 Rättning

Rättning körs i workern efter deltagarens kod, med tre sätt att kontrollera:

- **utdata** (det som skrivs ut, med val av hur strikt jämförelsen är: blanksteg, versaler),
- **variabler** (att `pris` har värdet 30 efter körning),
- **funktionstest** (anropa deltagarens funktion med givna indata och jämför svaret).

Återkopplingen är avsiktligt vänlig och specifik (se [pedagogik](#2-pedagogiska-principer)).

### 9.5 Lektionsformat

Lektioner skrivs som **Markdown** med några egna block för övningar, förutsägelser och stegvisning. Exempel:

````markdown
---
titel: Ändra en variabel
modul: 2
mal: Efter den här lektionen kan du ändra värdet på en variabel.
---

## Prova

```python-exempel
pris = 20
pris = pris + 5
print(pris)
```

```forutsag
kod: |
  a = 3
  a = a * 2
  print(a)
svar: "6"
```

```ovning
id: variabler-lon
uppgift: Sätt lön till 25000, höj den med 1000 och skriv ut den.
start: |
  # skriv din kod här
ratta: {utdata: "26000"}
ledtradar:
  - Börja med att skapa variabeln lön.
  - Ändra lön med "lön = lön + ...".
  - Sist ska du skriva ut lön med print.
facit: |
  lön = 25000
  lön = lön + 1000
  print(lön)
```
````

Formatet dokumenteras i `docs/skriva-lektioner.md` (ärende [#10](https://github.com/zorrzoor/programmeringskurs/issues/10)).
Ett ogiltigt block ger ett byggfel med fil och rad.

### 9.6 Framsteg, namn och integritet

- Framsteg (klara övningar, egen kod per övning, senaste lektion) sparas **på servern** under det valda namnet, så att
  man kan växla mellan enheter. Servern sparar inget annat: ingen statistik, inga IP-adresser, inga cookies.
- **Server:** en liten Node.js-server utan externa beroenden (inbyggda `node:sqlite`) med SQLite på en volym. Sidan och
  API:et levereras från samma adress, så det finns inga CORS-inställningar och inget som kan köras från annan sida.
- **API:**

  | Anrop | Gör |
  |---|---|
  | `GET /api/namn` | lista namnen |
  | `POST /api/namn` `{namn}` | skapa ett namn (409 om det finns) |
  | `GET /api/namn/{namn}/framsteg` | hämta allt framsteg för namnet |
  | `PUT /api/namn/{namn}/ovningar/{id}` `{kod, klar, tid}` | spara en övning (senaste ändring vinner) |
  | `PUT /api/namn/{namn}/senast` `{lektion}` | spara var man var |
  | `DELETE /api/namn/{namn}` | ta bort namnet och allt framsteg |
  | `GET /api/halsa` | för driftens hälsokontroll |

- **Begränsningar** mot missbruk och buggar: högst 50 namn, högst 20 kB kod per övning, högst 64 kB per anrop, enkel
  begränsning av antal anrop per minut, strikt validering av namn och id.
- **Flera enheter samtidigt:** per övning gäller senaste sparningen. Klar-markeringar bara läggs till (en övning som är
  klar blir inte oklar av att en annan enhet har äldre läge).
- **Export och import** av framsteg till en fil finns kvar som säkerhetskopia och som sätt att flytta till en annan
  installation.
- **Säkerhetskopia av servern:** databasen kopieras regelbundet (se [#33](https://github.com/zorrzoor/programmeringskurs/issues/33)).
- **Integritet:** namn och kod är personliga. Inget skickas till tredje part, inga externa teckensnitt eller skript.
  Det finns inget lösenord: åtkomsten skyddas utanför appen (kapitel 11).

### 9.7 Nätverk och avbrott

Kursen kräver servern: det är där framstegen sparas, och sidan och Pyodide hämtas därifrån. Kursen är **inte** en
installerbar app och fungerar inte utan nätverk (beslut: det behövs inte). Kortvariga avbrott hanteras ändå: ändringar i
framsteg köas i webbläsaren och skickas när servern svarar igen, och sidan visar tydligt "sparat" eller "sparas när du är
online igen". Filer som inte ändrats hämtas inte om (ETag).

### 9.8 Utseende och tillgänglighet

- Stor, lugn text (minst 18 px som bas), generösa marginaler, hög kontrast, ljust och mörkt läge, valbar textstorlek.
- Tydliga knappar med ord (inte bara ikoner), inget som blinkar eller rör sig oombett.
- Hela flödet går att använda med tangentbord. Rimliga etiketter för skärmläsare. Fungerar på surfplatta.
- Färg är aldrig det enda som skiljer rätt från fel.
- Automatisk tillgänglighetskontroll (axe) i CI, och en manuell genomgång.

### 9.9 Byggkedja och leverans

Servern och sidan paketeras i **en container-image** som byggs i CI och publiceras i GHCR med en oföränderlig tagg
(`sha-<7>`). Manifesten (`deploy/`) publiceras som OCI-artefakt bredvid imagen enligt klustrets tenant-modell, och
Flux tillämpar dem. Se [kapitel 11](#11-publicering-och-drift).

TypeScript och Vite, byggd och testad i **containrar** via `make` (inga verktyg installeras på arbetsmaskinen). Alla
beroenden och Pyodide-versionen är låsta. Hur verktygsmiljön (EE) delas med övriga repon avgörs i ett separat ärende
i `k3s_hosting`.

## 10. Kvalitet och tester

Eftersom en kurs är något man litar på är testerna en del av produkten.

| Kontroll | Vad den fångar |
|---|---|
| Facit mot rättning (headless Pyodide) | Ett facit som inte godkänns, eller en startkod som redan godkänns |
| Ledtrådar i tre steg, ord i ordlistan, länkar och bilder | Halvfärdiga övningar och trasiga länkar |
| Felmeddelandetabell | Att varje feltyp har en svensk förklaring |
| Webbläsartester (Playwright) | Hela flödet: läsa, skriva, köra, rätta, spara, stegvisa |
| Tillgänglighet (axe) | Kontrast, etiketter, tangentbord |
| Granskning av innehåll | Pedagogikreglerna i [kapitel 2](#2-pedagogiska-principer) bockas av i varje PR som ändrar lektioner |

Och viktigast: **provkörning med en riktig nybörjare** (ärende [#27](https://github.com/zorrzoor/programmeringskurs/issues/27))
efter modul 2, efter modul 5 och efter hela kursen. Observera, hjälp inte, anteckna var det tar stopp.

## 11. Publicering och drift

**Beslut: kursen körs i k3s-klustret** (eftersom framsteg sparas på servern). Den blir en *tenant* enligt klustrets
modell: appen äger sina manifest (`deploy/`) och sin image, plattformen ger en avgränsad namnrymd, ett godkänt värdnamn,
nätverksregler (inget in utom från Traefik) och backup.

- **Åtkomst: Cloudflare Access (beslutat, [#26](https://github.com/zorrzoor/programmeringskurs/issues/26)).** Appen har
  inget lösenord och ligger därför bakom Cloudflare Access, på samma sätt som vattenkoll: man anger sin e-postadress,
  får en engångskod och kommer in om adressen finns i listan över tillåtna. Fungerar på alla enheter och utanför hemmet.
  Namnen i appen är alltså ingen säkerhet; den som tagit sig förbi Access kan öppna alla namn.
- **Drift:** en pod, liten (≈ 50 MB minne), en volym för databasen (`local-path-sata`), hälsokontroll, loggar till
  stdout. Pod Security `restricted`, skrivskyddat rotfilsystem.
- **Utveckling lokalt:** `make dev` startar servern och sidan i containrar, utan klustret.
- **Plattformssidan** (namnrymd, värdnamn, nätverksregler, ev. Access) görs i `k3s_hosting` ([#34](https://github.com/zorrzoor/programmeringskurs/issues/34)).
  Alla åtgärder som kräver ägaren samlas i [docs/manuellt.md](manuellt.md).

## 12. Öppna frågor och risker

| Fråga / risk | Hantering |
|---|---|
| **Svenska eller engelska kodnamn?** Pythons ord är engelska. Variabler kan skrivas med å/ä/ö. | Exempelkod har svenska variabelnamn (`lön`, `pris`) för att hålla texten begriplig. Lektionerna förklarar tidigt att Pythons ord är engelska. Prövas i provkörningen. |
| **Pyodide är stor** (ca 10 MB för grunden) | Cachas efter första besöket. Läses in i bakgrunden medan modul 0 (utan kod) läses. |
| **Stegvisaren och långsamma program** | Stegbegränsning och tydligt meddelande. |
| **Mycket innehåll att skriva** | Moduler skrivs och provkörs en i taget. Valfria moduler (8) kan vänta. |
| **Svårt att veta om texten är begriplig** | Provkörning med en riktig nybörjare, och pedagogikreglerna som granskningslista. |
| **Wi-Fi/surfplatta/olika webbläsare** | Webbläsartester i Chromium och Firefox, manuell kontroll på Safari/surfplatta. |
| **Var ska kursen ligga?** | I k3s-klustret (kapitel 11). Åtkomst via Cloudflare Access (beslutat i [#26](https://github.com/zorrzoor/programmeringskurs/issues/26)). |
| **Inget lösenord: alla med åtkomst kan öppna och ta bort alla namn** | Medvetet val för enkelhetens skull. Skydd utanför appen (Cloudflare Access), bekräftelse genom att skriva namnet vid borttagning, och regelbunden säkerhetskopia. |
| **Förlorat framsteg** (felaktig borttagning, trasig volym) | Säkerhetskopia av databasen ([#33](https://github.com/zorrzoor/programmeringskurs/issues/33)) och export/import i appen. |
| **Servern ligger nere** | Sidan fungerar utan nätverk och köar framsteg tills servern svarar. |
| **Ska kursen ha en AI-handledare?** | Nej i första versionen: det kräver extern tjänst och bryter "inget lämnar sidan". Kan utredas senare. |
| **Gemensam EE med övriga repon** | Separat ärende i `k3s_hosting`. Skelettet (#3) börjar med en liten egen Node-image. |

## 13. Arbetsplan

Ordning, med det som inte kräver ägarens medverkan först:

1. Koncept (detta dokument) — [#2](https://github.com/zorrzoor/programmeringskurs/issues/2).
2. Skelett och CI — [#3](https://github.com/zorrzoor/programmeringskurs/issues/3).
3. Python i webbläsaren, redigerare, svenska fel — [#4](https://github.com/zorrzoor/programmeringskurs/issues/4),
   [#5](https://github.com/zorrzoor/programmeringskurs/issues/5), [#6](https://github.com/zorrzoor/programmeringskurs/issues/6).
4. Övningsformat, rättning, lektionsformat och CI-kontroll av facit — [#8](https://github.com/zorrzoor/programmeringskurs/issues/8),
   [#10](https://github.com/zorrzoor/programmeringskurs/issues/10), [#9](https://github.com/zorrzoor/programmeringskurs/issues/9).
5. Stegvisare, utseende — [#7](https://github.com/zorrzoor/programmeringskurs/issues/7), [#12](https://github.com/zorrzoor/programmeringskurs/issues/12).
5b. Server för framsteg, namnval, synk, image och leverans — [#30](https://github.com/zorrzoor/programmeringskurs/issues/30), [#31](https://github.com/zorrzoor/programmeringskurs/issues/31), [#32](https://github.com/zorrzoor/programmeringskurs/issues/32), [#35](https://github.com/zorrzoor/programmeringskurs/issues/35), [#36](https://github.com/zorrzoor/programmeringskurs/issues/36), [#11](https://github.com/zorrzoor/programmeringskurs/issues/11); plattformssidan [#34](https://github.com/zorrzoor/programmeringskurs/issues/34) och säkerhetskopia [#33](https://github.com/zorrzoor/programmeringskurs/issues/33).
6. Innehåll, modul 0–2 (#15–#17), **provkörning** (#27), justering.
7. Modul 3–7 (#18–#22), provkörning, ordlista (#25), end-to-end-tester (#14, klart).
8. Valfri modul 8 (#23), projekt (#24), publicering (#26).

Beslut och manuella steg som väntar på ägaren: provkörningar (#27) och åtgärderna i manuellt.md. Allt samlas i [manuellt.md](manuellt.md).
