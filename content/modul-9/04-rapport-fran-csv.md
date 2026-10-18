---
titel: "Projekt: rapport från en CSV-fil"
mal: "Efter den här lektionen har du byggt en rapport som läser en CSV-fil, summerar per projekt, sparar resultatet och ritar ett diagram."
tid: 45
---

Du bygger en rapport över arbetstimmar. Filen `arbetstid.csv` har en rad per dag, med antal timmar och vilket projekt du arbetade med. Den följer med varje steg.

```fil
namn: arbetstid.csv
innehall: |
  dag,timmar,projekt
  mån,6,webb
  tis,8,webb
  ons,4,app
  tors,7,app
  fre,5,webb
```

## Steg 1: Totalt antal timmar

```ovning
id: m9-rapport-total
uppgift: "Skriv ut det totala antalet timmar i `arbetstid.csv` (summan av kolumnen `timmar`)."
start: |
  import csv
ratta: {"utdata": "30"}
ledtradar:
  - "Läs filen med csv.DictReader och lägg ihop timmarna."
  - "Värdena i filen är text: använd int(rad[\"timmar\"])."
  - "total = total + int(rad[\"timmar\"]) i loopen, och print(total) efteråt."
facit: |
  import csv

  total = 0
  with open("arbetstid.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          total = total + int(rad["timmar"])
  print(total)
```

## Steg 2: Timmar per projekt

```ovning
id: m9-rapport-per-projekt
uppgift: "Skriv ut timmarna per projekt på formen `webb: 19`, i den ordning projekten först förekommer i filen."
start: |
  import csv
ratta: {"utdata": "webb: 19\napp: 11"}
ledtradar:
  - "Det är en summa per grupp, och projektet är gruppen."
  - "per_projekt[p] = per_projekt.get(p, 0) + int(rad[\"timmar\"])"
  - "Skriv ut med for p, t in per_projekt.items(): print(f\"{p}: {t}\")."
facit: |
  import csv

  per_projekt = {}
  with open("arbetstid.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          p = rad["projekt"]
          per_projekt[p] = per_projekt.get(p, 0) + int(rad["timmar"])
  for p, t in per_projekt.items():
      print(f"{p}: {t}")
```

## Steg 3: Skriv rapporten till en fil

```ovning
id: m9-rapport-fil
uppgift: "Skriv en fil `rapport.txt` med första raden `Totalt: 30 timmar` och sedan en rad per projekt på formen `webb: 19`, i den ordning projekten först förekommer."
start: |
  import csv
ratta: {"fil": "rapport.txt", "innehall": "Totalt: 30 timmar\nwebb: 19\napp: 11"}
ledtradar:
  - "Räkna både totalen och timmarna per projekt medan du läser filen, och skriv sedan rapporten."
  - "Öppna rapport.txt med \"w\", och kom ihåg radbyte (\\n) efter varje rad."
  - "ut.write(f\"Totalt: {total} timmar\\n\") först, och sedan en rad per projekt i en loop."
facit: |
  import csv

  total = 0
  per_projekt = {}
  with open("arbetstid.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          t = int(rad["timmar"])
          total = total + t
          p = rad["projekt"]
          per_projekt[p] = per_projekt.get(p, 0) + t

  with open("rapport.txt", "w", encoding="utf-8") as ut:
      ut.write(f"Totalt: {total} timmar\n")
      for p, t in per_projekt.items():
          ut.write(f"{p}: {t}\n")
```

## Steg 4: Ett diagram

```ovning
id: m9-rapport-diagram
uppgift: "Rita timmarna per projekt som staplar med ett `#` per timme, på formen `app: ###########`, i bokstavsordning efter projektets namn."
start: |
  import csv
ratta: {"utdata": "app: ###########\nwebb: ###################"}
ledtradar:
  - "Räkna timmar per projekt, och gå sedan igenom projekten i bokstavsordning med sorted(...)."
  - "En stapel är '#' multiplicerat med antalet timmar."
  - "print(f\"{p}: {'#' * per_projekt[p]}\") inne i loopen."
facit: |
  import csv

  per_projekt = {}
  with open("arbetstid.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          p = rad["projekt"]
          per_projekt[p] = per_projekt.get(p, 0) + int(rad["timmar"])
  for p in sorted(per_projekt):
      print(f"{p}: {'#' * per_projekt[p]}")
```

## Förbättra själv

- Räkna ut genomsnittligt antal timmar per dag.
- Skriv ut den dag med flest timmar.
- Lägg till en kolumn i filen och räkna på den.

## Det här lärde du dig

- Du kan läsa, summera, skriva och rita i ett och samma program.
- Mönstret "summa per grupp" återkommer överallt där det finns tabelldata.
- Resultat kan sparas i en fil för att användas senare.
