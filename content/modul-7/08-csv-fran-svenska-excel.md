---
titel: "CSV från svenska Excel"
mal: "Efter den här lektionen kan du läsa en CSV-fil som har semikolon och decimalkomma, som den svenska Excel sparar den."
---

```ruta
rubrik: Kort om CSV
text: |
  **CSV** (comma-separated values) är en tabell som textfil: en rad per rad i tabellen, kolumnerna åtskilda av ett tecken (oftast komma) och rubrikerna på första raden.

  - **Med Excel:** en CSV-fil öppnas i Excel som ett vanligt kalkylblad, och ett kalkylblad sparas som CSV med Arkiv, Spara som och filtypen CSV. Så flyttas data mellan program.
  - **I kursen:** CSV-filerna visas i lektionen och följer med koden, som läser dem med `csv.DictReader` och skriver dem med `csv.DictWriter`.
```

I den här lektionen följer filen `lon.csv` med, sparad som en svensk Excel skulle spara den.

```fil
namn: lon.csv
innehall: |
  namn;lon
  Anna;31500,50
  Bo;28000,00
  Cia;35250,75
```

## Prova först

Kör koden. Notera tecknet mellan kolumnerna, och hur lönerna skrivs.

```python-exempel
import csv

total = 0
with open("lon.csv", encoding="utf-8") as fil:
    for rad in csv.DictReader(fil, delimiter=";"):
        lon = float(rad["lon"].replace(",", "."))
        total = total + lon
print(total)
```

## Två skillnader

I Sverige skrivs decimaltal med **komma** (`31500,50`), men ett komma skulle då förväxlas med kolumnavskiljaren. Därför sparar en svensk Excel CSV-filer med **semikolon** mellan kolumnerna. Du anpassar Python på två ställen:

1. `csv.DictReader(fil, delimiter=";")` talar om att kolumnerna skiljs åt med semikolon.
2. `rad["lon"].replace(",", ".")` byter decimalkomma mot decimalpunkt, och `float(...)` gör sedan om texten till ett tal. Python förstår bara punkt.

Ett tredje som kan hända: väljer du CSV UTF-8 i Excel läggs ett osynligt märke (BOM) först i filen, och då blir den första rubriken konstig. Öppna filen med `encoding="utf-8-sig"` i stället för `"utf-8"` så försvinner det.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det är de regionala inställningarna i Excel som styr: en engelsk Excel sparar komma mellan kolumnerna och punkt som decimaltecken, en svensk semikolon och decimalkomma. Därför ser samma tabell olika ut som textfil beroende på var den sparades.
```

## Fråga

```forutsag
kod: |
  print(float("12,5".replace(",", ".")) + 1)
kor: true
alternativ: ["13.5", "12,51", "13,5", "Ett felmeddelande"]
ratt: 0
forklaring: "Kommat byts mot en punkt, så texten blir 12.5, som float blir talet 12.5. Plus 1 ger 13.5, med punkt som decimaltecken i Python."
```

## Din tur

```ovning
id: m7-sv-medel
uppgift: "Skriv ut medellönen i `lon.csv` (summan av lönerna delad med antalet personer)."
start: |
  import csv
ratta: {"utdata": "31583.75"}
ledtradar:
  - "Du behöver både en summa och ett antal, och rätt avskiljare."
  - "delimiter=\";\" i DictReader, och float(rad[\"lon\"].replace(\",\", \".\")) för lönen."
  - "total = total + ..., antal = antal + 1 i loopen, och print(total / antal) efteråt."
facit: |
  import csv

  total = 0
  antal = 0
  with open("lon.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil, delimiter=";"):
          total = total + float(rad["lon"].replace(",", "."))
          antal = antal + 1
  print(total / antal)
```

```ovning
id: m7-sv-hoga
uppgift: "Skriv ut namn och lön, på formen `Anna: 31500.5`, för de som har en lön över 30000, en per rad."
start: |
  import csv
ratta: {"utdata": "Anna: 31500.5\nCia: 35250.75"}
ledtradar:
  - "Gör om lönen till ett tal först, och jämför sedan."
  - "if lon > 30000: inne i loopen, och skriv ut med en f-sträng."
  - "print(f\"{rad['namn']}: {lon}\") när villkoret stämmer."
facit: |
  import csv

  with open("lon.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil, delimiter=";"):
          lon = float(rad["lon"].replace(",", "."))
          if lon > 30000:
              print(f"{rad['namn']}: {lon}")
```

```ovning
id: m7-sv-funktion
uppgift: "Skriv en funktion `till_tal(text)` som gör om en text med decimalkomma, som `\"31500,50\"`, till ett decimaltal."
start: |
  # skriv din funktion här
ratta: {"funktion": "till_tal", "tester": [{"in": ["31500,50"], "ut": 31500.5}, {"in": ["12"], "ut": 12.0}, {"in": ["0,25"], "ut": 0.25}]}
ledtradar:
  - "Byt komma mot punkt, och gör om till tal."
  - "text.replace(\",\", \".\") byter tecknet, och float(...) gör talet."
  - "return float(text.replace(\",\", \".\"))"
facit: |
  def till_tal(text):
      return float(text.replace(",", "."))
```

## Det här lärde du dig

- Svensk Excel sparar CSV med semikolon mellan kolumnerna och komma som decimaltecken.
- `csv.DictReader(fil, delimiter=";")` läser semikolon, och `.replace(",", ".")` ger ett tal som `float` förstår.
- `encoding="utf-8-sig"` tar bort det osynliga märke (BOM) som Excel kan lägga först i filen.
