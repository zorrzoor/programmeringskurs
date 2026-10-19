---
titel: "Blandad övning: data och filer"
mal: Efter den här lektionen har du övat att läsa, summera, filtrera, skriva och rita data från en fil.
---

```ruta
rubrik: Kort om CSV
text: |
  **CSV** (comma-separated values) är en tabell som textfil: en rad per rad i tabellen, kolumnerna åtskilda av ett tecken (oftast komma) och rubrikerna på första raden.

  - **Med Excel:** en CSV-fil öppnas i Excel som ett vanligt kalkylblad, och ett kalkylblad sparas som CSV med Arkiv, Spara som och filtypen CSV. Så flyttas data mellan program.
  - **I kursen:** CSV-filerna visas i lektionen och följer med koden, som läser dem med `csv.DictReader` och skriver dem med `csv.DictWriter`.
```

## Innan du börjar

I den här lektionen finns en annan fil med ordrar: en kund och ett belopp per rad. Allt du lärt dig i modulen behövs.

```fil
namn: ordrar.csv
innehall: |
  kund,belopp
  Anna,500
  Bo,300
  Anna,200
  Cia,1000
  Bo,100
```

## Uppgifter

```ovning
id: m7-blandat-per-kund
uppgift: "Skriv ut totalt belopp per kund på formen `Anna: 700`, en kund per rad, i den ordning kunderna först förekommer."
start: |
  import csv
ratta: {utdata: "Anna: 700\nBo: 400\nCia: 1000"}
ledtradar:
  - Det är en summa per grupp, och kunden är gruppen.
  - "summor[kund] = summor.get(kund, 0) + int(rad[\"belopp\"])"
  - "Skriv sedan ut med for kund, summa in summor.items(): print(f\"{kund}: {summa}\")."
facit: |
  import csv

  summor = {}
  with open("ordrar.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          kund = rad["kund"]
          summor[kund] = summor.get(kund, 0) + int(rad["belopp"])
  for kund, summa in summor.items():
      print(f"{kund}: {summa}")
```

```ovning
id: m7-blandat-storkunder
uppgift: "Skriv en fil `storkunder.txt` med namnen på de kunder vars totala belopp är över 500, ett namn per rad, i den ordning kunderna först förekommer."
start: |
  import csv
ratta: {fil: storkunder.txt, innehall: "Anna\nCia"}
ledtradar:
  - Räkna först totalen per kund.
  - Gå sedan igenom summorna och skriv bara de som är över 500.
  - "if summa > 500: ut.write(kund + \"\\n\") inne i loopen, med filen öppnad för skrivning."
facit: |
  import csv

  summor = {}
  with open("ordrar.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          kund = rad["kund"]
          summor[kund] = summor.get(kund, 0) + int(rad["belopp"])

  with open("storkunder.txt", "w", encoding="utf-8") as ut:
      for kund, summa in summor.items():
          if summa > 500:
              ut.write(kund + "\n")
```

```ovning
id: m7-blandat-diagram
uppgift: "Rita totalt belopp per kund som staplar, ett `#` per hundra kronor, på formen `Anna: #######`."
start: |
  import csv
ratta: {utdata: "Anna: #######\nBo: ####\nCia: ##########"}
ledtradar:
  - Räkna totalen per kund först.
  - Antalet staplar är summa // 100.
  - "print(f\"{kund}: {'#' * (summa // 100)}\")"
facit: |
  import csv

  summor = {}
  with open("ordrar.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          kund = rad["kund"]
          summor[kund] = summor.get(kund, 0) + int(rad["belopp"])
  for kund, summa in summor.items():
      print(f"{kund}: {'#' * (summa // 100)}")
```

## Det här lärde du dig i modulen

- Du öppnar och läser filer, och en CSV-fil ger rader som uppslag.
- Du räknar, filtrerar och summerar per grupp med ett uppslag.
- Du skriver resultat till en ny fil och ritar enkla diagram med text.
