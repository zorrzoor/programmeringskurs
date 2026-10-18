---
titel: Tabeller i CSV-filer
mal: Efter den här lektionen kan du läsa en CSV-fil och komma åt varje kolumn med dess rubrik.
---

En **CSV-fil** är en tabell som textfil: en rad per rad i tabellen, med kolumnerna åtskilda av komma. Den här filen följer med lektionens exempel och övningar.

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

Första raden är **rubrikerna**. Det är samma tabell som du skulle se i ett kalkylblad, men som ren text.

## Prova först

Kör koden. Titta på vad varje rad blir.

```python-exempel
import csv

with open("forsaljning.csv", encoding="utf-8") as fil:
    for rad in csv.DictReader(fil):
        print(rad)
```

## Varje rad är ett uppslag

`csv.DictReader` läser tabellen och ger dig varje rad som ett **uppslag** (dict), som du kan från modul 5, där nycklarna är rubrikerna: `rad["vara"]`.

**Obs:** allt från en fil är **text**, även siffror. `rad["antal"]` är texten `"3"`, inte talet 3. Du gör om den med `int(...)` för heltal eller `float(...)` för decimaltal innan du räknar.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  En CSV-fil kan öppnas i Excel, som då visar den som ett kalkylblad. Rubrikraden blir kolumnrubrikerna. I Python blir den nycklarna i varje rad.
```

```forutsag
kod: |
  import csv

  with open("forsaljning.csv", encoding="utf-8") as fil:
      rader = list(csv.DictReader(fil))
  print(len(rader))
  print(rader[1]["vara"])
alternativ: ["5 och te", "6 och te", "5 och kaffe", "5 och vara"]
ratt: 0
forklaring: "Filen har fem datarader (rubrikraden räknas inte). Plats 1 är den andra raden, och där är varan te."
```

## Din tur

```ovning
id: m7-csv-varor
uppgift: "Skriv ut namnet på varje vara i filen `forsaljning.csv`, en per rad, i den ordning de står."
start: |
  import csv
ratta: {utdata: "kaffe\nte\nkaffe\nbulle\nte"}
ledtradar:
  - Öppna filen och gå igenom raderna med csv.DictReader.
  - Varje rad är ett uppslag, och varan finns under nyckeln "vara".
  - "for rad in csv.DictReader(fil): och print(rad[\"vara\"]) inne i loopen."
facit: |
  import csv

  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          print(rad["vara"])
```

```ovning
id: m7-csv-antal-delar
uppgift: "Räkna ut hur många enheter som såldes sammanlagt (summan av kolumnen `antal`) och skriv ut det. Kom ihåg att göra om texten till tal."
start: |
  import csv
ratta: {utdata: "11"}
ledtradar:
  - Skapa en summa som börjar på 0, och lägg till antalet för varje rad.
  - Värdet i filen är text, så använd int(rad["antal"]).
  - "summa = summa + int(rad[\"antal\"]) inne i loopen, och print(summa) efteråt."
facit: |
  import csv

  summa = 0
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          summa = summa + int(rad["antal"])
  print(summa)
```

## Det här lärde du dig

- En CSV-fil är en tabell som text, med komma mellan kolumnerna och rubriker på första raden.
- `csv.DictReader(fil)` ger varje rad som ett uppslag med rubrikerna som nycklar.
- Allt från en fil är text: gör om med `int(...)` eller `float(...)` innan du räknar.
