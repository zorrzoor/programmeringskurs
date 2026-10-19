---
titel: "Skriva CSV-filer"
mal: "Efter den här lektionen kan du skriva en korrekt CSV-fil från dina data, även när värdena innehåller komma."
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

Kör koden. Programmet skriver en CSV-fil från en lista av uppslag, och läser sedan tillbaka den för att visa vad som hamnade i den.

```python-exempel
import csv

rader = [{"namn": "Anna", "poang": 10}, {"namn": "Bo", "poang": 7}]

with open("poang.csv", "w", newline="", encoding="utf-8") as ut:
    skrivare = csv.DictWriter(ut, fieldnames=["namn", "poang"])
    skrivare.writeheader()
    skrivare.writerows(rader)

print(open("poang.csv", encoding="utf-8").read())
```

## DictWriter

Du kan skriva CSV för hand med `fil.write(f"{a},{b}\n")`, men det går fel så fort ett värde innehåller ett komma: adressen `Storgatan 1, Lund` skulle bli två kolumner. `csv.DictWriter` sätter citattecken runt sådana värden åt dig.

- `csv.DictWriter(fil, fieldnames=[...])` skapar skrivaren, och `fieldnames` är kolumnerna i ordning.
- `skrivare.writeheader()` skriver rubrikraden.
- `skrivare.writerow(rad)` skriver en rad, och `skrivare.writerows(lista)` skriver alla rader i en lista av uppslag.
- Öppna filen med `newline=""` så blir radbytena rätt.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det motsvarar Arkiv, Spara som, CSV: Excel gör samma sak åt dig, med citattecken runt text som innehåller kommatecken. Filen kan sedan öppnas i Excel.
```

## Fråga

```forutsag
kod: |
  import csv, io

  ut = io.StringIO()
  skrivare = csv.DictWriter(ut, fieldnames=["stad"])
  skrivare.writerow({"stad": "Lund, Sverige"})
  print(ut.getvalue().strip())
kor: true
alternativ: ["\"Lund, Sverige\"", "Lund, Sverige", "Lund Sverige", "Ett felmeddelande"]
ratt: 0
forklaring: "Värdet innehåller ett komma, så DictWriter sätter citattecken runt det: \\\"Lund, Sverige\\\". Då förstår en som läser filen att det är en enda kolumn."
```

## Din tur

```ovning
id: m7-skriv-csv-omsattning
uppgift: "Räkna ut omsättningen (antal gånger pris) per vara från `forsaljning.csv` och skriv den till en ny CSV-fil `omsattning.csv` med rubrikerna `vara` och `summa`, med en rad per vara i den ordning varorna först förekommer."
start: |
  import csv
ratta: {"fil": "omsattning.csv", "innehall": "vara,summa\nkaffe,120\nte,75\nbulle,60"}
ledtradar:
  - "Räkna först omsättningen per vara, och skriv sedan filen med DictWriter."
  - "Öppna omsattning.csv med \"w\", newline=\"\" och skapa en DictWriter med fieldnames=[\"vara\", \"summa\"]."
  - "skrivare.writeheader() först, och sedan skrivare.writerow({\"vara\": vara, \"summa\": summa}) för varje vara."
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])

  with open("omsattning.csv", "w", newline="", encoding="utf-8") as ut:
      skrivare = csv.DictWriter(ut, fieldnames=["vara", "summa"])
      skrivare.writeheader()
      for vara, summa in summor.items():
          skrivare.writerow({"vara": vara, "summa": summa})
```

```ovning
id: m7-skriv-csv-komma
uppgift: "Listan `adresser` finns redan. Skriv den till `adresser.csv` med rubrikerna `namn` och `adress`. Adresserna innehåller kommatecken, så använd DictWriter."
krav: ["anropa:DictWriter"]
start: |
  import csv

  adresser = [{"namn": "Anna", "adress": "Storgatan 1, Lund"}, {"namn": "Bo", "adress": "Kungsgatan 5"}]
ratta: {"fil": "adresser.csv", "innehall": "namn,adress\nAnna,\"Storgatan 1, Lund\"\nBo,Kungsgatan 5"}
ledtradar:
  - "Använd csv.DictWriter, så får värden med komma citattecken automatiskt."
  - "Skapa skrivaren med fieldnames=[\"namn\", \"adress\"], skriv rubriken och sedan alla rader."
  - "skrivare.writeheader() och skrivare.writerows(adresser) inne i with-blocket."
facit: |
  import csv

  adresser = [{"namn": "Anna", "adress": "Storgatan 1, Lund"}, {"namn": "Bo", "adress": "Kungsgatan 5"}]

  with open("adresser.csv", "w", newline="", encoding="utf-8") as ut:
      skrivare = csv.DictWriter(ut, fieldnames=["namn", "adress"])
      skrivare.writeheader()
      skrivare.writerows(adresser)
```

```ovning
id: m7-skriv-csv-extra-kolumn
uppgift: "Läs `forsaljning.csv` och skriv en ny fil `med_summa.csv` med alla ursprungliga kolumner plus en kolumn `summa` (antal gånger pris) för varje rad."
start: |
  import csv
ratta: {"fil": "med_summa.csv", "innehall": "vara,antal,pris,summa\nkaffe,3,30,90\nte,2,25,50\nkaffe,1,30,30\nbulle,4,15,60\nte,1,25,25"}
ledtradar:
  - "Läs raderna till en lista först, lägg till en nyckel summa i varje rad och skriv sedan filen."
  - "fieldnames ska innehålla de fyra kolumnerna i ordning: vara, antal, pris, summa."
  - "rad[\"summa\"] = int(rad[\"antal\"]) * int(rad[\"pris\"]) och skrivare.writerow(rad) i loopen."
facit: |
  import csv

  with open("forsaljning.csv", encoding="utf-8") as fil:
      rader = list(csv.DictReader(fil))

  with open("med_summa.csv", "w", newline="", encoding="utf-8") as ut:
      skrivare = csv.DictWriter(ut, fieldnames=["vara", "antal", "pris", "summa"])
      skrivare.writeheader()
      for rad in rader:
          rad["summa"] = int(rad["antal"]) * int(rad["pris"])
          skrivare.writerow(rad)
```

## Det här lärde du dig

- `csv.DictWriter(fil, fieldnames=[...])` skriver CSV, med `writeheader()`, `writerow(rad)` och `writerows(lista)`.
- DictWriter sätter citattecken runt värden som innehåller komma, vilket handskrivna rader inte gör.
- Öppna filen med `"w"` och `newline=""` när du skriver CSV.
