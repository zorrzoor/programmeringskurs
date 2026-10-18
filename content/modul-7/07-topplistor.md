---
titel: "Topplistor"
mal: "Efter den här lektionen kan du sortera grupper efter deras summa och göra en topplista."
---

```ruta
rubrik: Kort om CSV
text: |
  **CSV** (comma-separated values) är en tabell som textfil: en rad per rad i tabellen, med kolumnerna åtskilda av ett tecken (oftast komma) och rubrikerna på första raden. **Med Excel:** en CSV-fil öppnas i Excel som ett vanligt kalkylblad, och ett kalkylblad sparas som CSV med Arkiv, Spara som och filtypen CSV, så att data kan flyttas mellan program. **I kursen:** CSV-filerna visas i lektionen och följer med koden, som läser dem med `csv.DictReader` och skriver dem med `csv.DictWriter`.
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

Kör koden. Varorna är sorterade efter omsättning, störst först.

```python-exempel
import csv

summor = {}
with open("forsaljning.csv", encoding="utf-8") as fil:
    for rad in csv.DictReader(fil):
        vara = rad["vara"]
        summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])

for vara in sorted(summor, key=summor.get, reverse=True):
    print(vara, summor[vara])
```

## Sortera efter värdet

Ett uppslag har nycklar och värden, och `sorted(uppslag)` sorterar nycklarna i bokstavsordning. Vill du sortera nycklarna efter **värdet** lägger du till `key=uppslag.get`: det betyder "ta reda på värdet för varje nyckel med `.get` och sortera efter det". Med `reverse=True` kommer störst först.

- `sorted(summor, key=summor.get)` är varorna med minst omsättning först.
- `sorted(summor, key=summor.get, reverse=True)[:2]` är de två bästa.
- `max(summor, key=summor.get)` är den enda bästa, och `min(...)` den sämsta.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det är som att sortera en pivottabell på summakolumnen, eller använda Filtrera, Topp 10 på en kolumn.
```

## Fråga

```forutsag
kod: |
  summor = {"a": 5, "b": 9, "c": 2}
  print(sorted(summor, key=summor.get))
kor: true
alternativ: ["['c', 'a', 'b']", "['b', 'a', 'c']", "[2, 5, 9]", "['a', 'b', 'c']"]
ratt: 0
forklaring: "Nycklarna sorteras efter sina värden, minst först: c (2), a (5) och b (9). Det som sorteras är nycklarna, inte värdena."
```

## Din tur

```ovning
id: m7-topp-rangordning
uppgift: "Räkna ut omsättningen (antal gånger pris) per vara och skriv ut varorna på formen `kaffe 120`, den med störst omsättning först."
start: |
  import csv
ratta: {"utdata": "kaffe 120\nte 75\nbulle 60"}
ledtradar:
  - "Bygg först ett uppslag med omsättning per vara."
  - "Sortera nycklarna efter värdet, störst först, med key=summor.get och reverse=True."
  - "for vara in sorted(summor, key=summor.get, reverse=True): print(vara, summor[vara])"
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])
  for vara in sorted(summor, key=summor.get, reverse=True):
      print(vara, summor[vara])
```

```ovning
id: m7-topp-sist
uppgift: "Skriv ut namnet på den vara som har lägst omsättning."
start: |
  import csv
ratta: {"utdata": "bulle"}
ledtradar:
  - "Räkna omsättning per vara först."
  - "min(uppslag, key=uppslag.get) ger nyckeln med lägst värde."
  - "print(min(summor, key=summor.get))"
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])
  print(min(summor, key=summor.get))
```

```ovning
id: m7-topp-tva
uppgift: "Skriv ut namnen på de två varorna med högst omsättning, en per rad, störst först."
start: |
  import csv
ratta: {"utdata": "kaffe\nte"}
ledtradar:
  - "Sortera varorna efter omsättning, störst först, och ta de två första."
  - "sorted(...)[:2] ger de två första i den sorterade listan."
  - "for vara in sorted(summor, key=summor.get, reverse=True)[:2]: print(vara)"
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])
  for vara in sorted(summor, key=summor.get, reverse=True)[:2]:
      print(vara)
```

## Det här lärde du dig

- `sorted(uppslag, key=uppslag.get)` sorterar nycklarna efter sina värden, och `reverse=True` vänder på ordningen.
- `max(uppslag, key=uppslag.get)` och `min(...)` ger nyckeln med störst respektive minst värde.
- Med `[:n]` får du de `n` första i en topplista.
