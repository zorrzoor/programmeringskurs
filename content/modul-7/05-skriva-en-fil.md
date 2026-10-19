---
titel: Skriva en fil
mal: Efter den här lektionen kan du spara ett resultat i en ny fil.
---

```ruta
rubrik: Kort om CSV
text: |
  **CSV** (comma-separated values) är en tabell som textfil: en rad per rad i tabellen, kolumnerna åtskilda av ett tecken (oftast komma) och rubrikerna på första raden.

  - **Med Excel:** en CSV-fil öppnas i Excel som ett vanligt kalkylblad, och ett kalkylblad sparas som CSV med Arkiv, Spara som och filtypen CSV. Så flyttas data mellan program.
  - **I kursen:** CSV-filerna visas i lektionen och följer med koden, som läser dem med `csv.DictReader` och skriver dem med `csv.DictWriter`.
```

Samma fil som förut följer med.

```fil
namn: forsaljning.csv
innehall: |
  vara,antal,pris
  kaffe,3,30
  te,2,25
  kaffe,1,30
  bulle,4,15
  te,1,25
```

## Prova först

Kör koden. Programmet skriver en fil och läser sedan tillbaka den för att visa vad som hamnade i den.

```python-exempel
with open("hej.txt", "w", encoding="utf-8") as fil:
    fil.write("Första raden\n")
    fil.write("Andra raden\n")

with open("hej.txt", encoding="utf-8") as fil:
    print(fil.read())
```

## Öppna för skrivning

Med `"w"` som andra värde i `open` öppnas filen för **skrivning** (write). Finns filen redan **ersätts** innehållet, så var försiktig med namnet. `fil.write(text)` skriver texten, men lägger **inte** till ett radbyte åt dig: skriv `\n` i slutet av varje rad.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det motsvarar Arkiv, Spara som. Filen som skrivs här sparas bara under tiden övningen körs, och försvinner när du kör en gång till eller lämnar sidan. Det är en övning, och inget som ligger kvar på din dator.
```

```forutsag
kod: |
  with open("a.txt", "w", encoding="utf-8") as fil:
      fil.write("ett")
      fil.write("två")

  with open("a.txt", encoding="utf-8") as fil:
      print(fil.read())
alternativ: ["ettvå", "ett två", "ett och två på varsin rad", "Ett felmeddelande"]
ratt: 0
forklaring: "write lägger inte till något radbyte. Texterna sätts ihop direkt efter varandra: ettvå."
```

## Din tur

```ovning
id: m7-skriv-rapport
uppgift: "Räkna ut antal sålda enheter per vara från `forsaljning.csv` och skriv resultatet till en ny fil `rapport.txt`, en vara per rad på formen `kaffe: 4`, i den ordning varorna först förekommer."
start: |
  import csv
ratta: {fil: rapport.txt, innehall: "kaffe: 4\nte: 3\nbulle: 4"}
ledtradar:
  - Räkna först antalet per vara i ett uppslag, och skriv sedan filen.
  - Öppna rapport.txt med "w", och skriv en rad för varje vara med fil.write.
  - "fil.write(f\"{vara}: {summa}\\n\") inne i for vara, summa in antal.items():"
facit: |
  import csv

  antal = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          antal[rad["vara"]] = antal.get(rad["vara"], 0) + int(rad["antal"])

  with open("rapport.txt", "w", encoding="utf-8") as ut:
      for vara, summa in antal.items():
          ut.write(f"{vara}: {summa}\n")
```

```ovning
id: m7-skriv-csv
uppgift: "Skriv en ny CSV-fil `omsattning.csv` med rubrikraden `vara,summa` och sedan en rad per vara med omsättningen (antal gånger pris), i den ordning varorna först förekommer."
start: |
  import csv
ratta: {fil: omsattning.csv, innehall: "vara,summa\nkaffe,120\nte,75\nbulle,60"}
ledtradar:
  - Räkna omsättningen per vara först, och skriv sedan filen.
  - Skriv rubrikraden som en egen rad före loopen. Kom ihåg radbyte.
  - "fil.write(\"vara,summa\\n\") före loopen och fil.write(f\"{vara},{summa}\\n\") i loopen."
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])

  with open("omsattning.csv", "w", encoding="utf-8") as ut:
      ut.write("vara,summa\n")
      for vara, summa in summor.items():
          ut.write(f"{vara},{summa}\n")
```

## Det här lärde du dig

- `open("fil.txt", "w")` öppnar för skrivning, och ersätter filen om den finns.
- `fil.write(text)` skriver text, men inget radbyte: lägg till `\n` själv.
- En CSV-fil du skriver är bara rader med komma emellan, och första raden är rubrikerna.
