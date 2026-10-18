---
titel: Räkna och filtrera
mal: Efter den här lektionen kan du räkna ut summor och medelvärden från en fil, och välja ut de rader du vill ha.
---

```ruta
rubrik: Kort om CSV
text: |
  **CSV** (comma-separated values) är en tabell som textfil: en rad per rad i tabellen, med kolumnerna åtskilda av ett tecken (oftast komma) och rubrikerna på första raden. **Med Excel:** en CSV-fil öppnas i Excel som ett vanligt kalkylblad, och ett kalkylblad sparas som CSV med Arkiv, Spara som och filtypen CSV, så att data kan flyttas mellan program. **I kursen:** CSV-filerna visas i lektionen och följer med koden, som läser dem med `csv.DictReader` och skriver dem med `csv.DictWriter`.
```

Samma fil som i förra lektionen följer med här.

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

Kör koden. Varje rad räknas ut för sig, och summan byggs upp.

```python-exempel
import csv

total = 0
with open("forsaljning.csv", encoding="utf-8") as fil:
    for rad in csv.DictReader(fil):
        belopp = int(rad["antal"]) * int(rad["pris"])
        total = total + belopp
print(f"Total försäljning: {total} kr")
```

## Räkna och välja ut

Du kombinerar det du kan sedan tidigare:

- Räkna ut ett värde per rad, till exempel antal gånger pris.
- Bygg upp en summa eller en räknare i en loop.
- Välj ut rader med en `if`: `if rad["vara"] == "te":`.

För ett medelvärde delar du summan med antalet rader, och räknar antalet i samma loop.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det här motsvarar funktionerna `SUMMA.OM`, `ANTAL.OM` och `MEDEL`, och ett filter på en kolumn. Skillnaden är att du själv anger stegen, vilket gör att du kan göra beräkningar som inte finns som färdig funktion.
```

```forutsag
kod: |
  import csv

  antal = 0
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          if int(rad["pris"]) > 20:
              antal = antal + 1
  print(antal)
alternativ: ["4", "5", "2", "3"]
ratt: 0
forklaring: "Priserna är 30, 25, 30, 15 och 25. Fyra av dem är över 20: kaffe, te, kaffe och te. Bullen kostar 15."
```

## Din tur

```ovning
id: m7-rakna-te
uppgift: "Skriv ut hur många `te` som såldes sammanlagt (summan av `antal` på de rader där varan är `te`)."
start: |
  import csv
ratta: {utdata: "3"}
ledtradar:
  - Gå igenom raderna, och använd en if för att bara räkna raderna med te.
  - Lägg till int(rad["antal"]) till en summa som börjar på 0.
  - "if rad[\"vara\"] == \"te\": och summa = summa + int(rad[\"antal\"]) inne i den."
facit: |
  import csv

  summa = 0
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          if rad["vara"] == "te":
              summa = summa + int(rad["antal"])
  print(summa)
```

```ovning
id: m7-rakna-dyraste
uppgift: "Skriv ut namnet på den vara som har högst pris. Om flera har samma högsta pris räcker det med den första."
start: |
  import csv
ratta: {utdata: "kaffe"}
ledtradar:
  - Håll reda på det högsta priset hittills och vilken vara det hör till.
  - Börja med ett lågt pris, till exempel 0, och uppdatera båda när du hittar ett högre.
  - "if pris > hogsta: hogsta = pris och dyrast = rad[\"vara\"], och print(dyrast) efter loopen."
facit: |
  import csv

  hogsta = 0
  dyrast = ""
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          pris = int(rad["pris"])
          if pris > hogsta:
              hogsta = pris
              dyrast = rad["vara"]
  print(dyrast)
```

```ovning
id: m7-rakna-medelpris
uppgift: "Skriv ut medelpriset (summan av alla priser delad med antalet rader). Det ska bli `25.0`."
start: |
  import csv
ratta: {utdata: "25.0"}
ledtradar:
  - Du behöver både en summa av priserna och ett antal rader.
  - Båda byggs upp i samma loop, och delningen görs efter loopen.
  - "summa = summa + int(rad[\"pris\"]) och antal = antal + 1 i loopen, och print(summa / antal) efteråt."
facit: |
  import csv

  summa = 0
  antal = 0
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          summa = summa + int(rad["pris"])
          antal = antal + 1
  print(summa / antal)
```

## Det här lärde du dig

- Du räknar per rad och bygger upp summor och räknare i en loop.
- `if` i loopen väljer ut de rader du vill räkna med.
- Medelvärde är summan delad med antalet, och båda byggs upp i samma loop.
