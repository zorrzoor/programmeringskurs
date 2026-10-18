---
titel: Ett enkelt diagram
mal: Efter den här lektionen kan du rita ett stapeldiagram med text, där varje stapel är en rad med tecken.
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

Kör koden. Varje vara får en stapel, där en enhet är ett `#`.

```python-exempel
import csv

antal = {}
with open("forsaljning.csv", encoding="utf-8") as fil:
    for rad in csv.DictReader(fil):
        antal[rad["vara"]] = antal.get(rad["vara"], 0) + int(rad["antal"])

for vara, n in antal.items():
    print(f"{vara}: {'#' * n}")
```

## Att multiplicera text

I modul 1 såg du att `"ha" * 3` blir `"hahaha"`. Då blir `"#" * 5` fem `#` på rad: en stapel. Sätt ett namn framför och du har en rad i ett diagram. Är talen stora kan du dela dem först: `"#" * (summa // 10)` ger ett `#` per tio kronor (`//` är heltalsdelning).

Riktiga diagram med färger och axlar görs med särskilda bibliotek. De ingår inte i den här kursen, men principen är densamma: räkna ut talen först, och rita sedan.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det motsvarar att välja Infoga, Stapeldiagram på en kolumn med summor. Skillnaden är att du själv bestämmer hur varje stapel ritas.
```

```forutsag
kod: |
  for n in [2, 0, 3]:
      print("x" * n + "|")
alternativ: ["xx|, | och xxx|, på varsin rad", "xx, , xxx", "x2|, x0|, x3|", "Ett felmeddelande"]
ratt: 0
forklaring: "Varje varv ger n stycken x följt av ett lodrätt streck. Med n = 0 blir det bara strecket."
```

## Din tur

```ovning
id: m7-diagram-omsattning
uppgift: "Rita omsättningen per vara (antal gånger pris) som staplar där varje `#` är tio kronor, på formen `kaffe: ############`. Varorna i den ordning de först förekommer."
start: |
  import csv
ratta: {utdata: "kaffe: ############\nte: #######\nbulle: ######"}
ledtradar:
  - Räkna först ut omsättningen per vara, till exempel 120 för kaffe.
  - Antalet staplar får du med summa // 10.
  - "print(f\"{vara}: {'#' * (summa // 10)}\") inne i loopen över uppslaget."
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])
  for vara, summa in summor.items():
      print(f"{vara}: {'#' * (summa // 10)}")
```

```ovning
id: m7-diagram-enheter
uppgift: "Rita antal sålda enheter per vara, med ett `#` per enhet, men skriv bara ut de varor där minst 4 enheter såldes."
start: |
  import csv
ratta: {utdata: "kaffe: ####\nbulle: ####"}
ledtradar:
  - Räkna antal per vara i ett uppslag.
  - Använd en if i loopen över uppslaget, så att bara varor med minst 4 skrivs ut.
  - "if n >= 4: print(f\"{vara}: {'#' * n}\")"
facit: |
  import csv

  antal = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          antal[rad["vara"]] = antal.get(rad["vara"], 0) + int(rad["antal"])
  for vara, n in antal.items():
      if n >= 4:
          print(f"{vara}: {'#' * n}")
```

## Det här lärde du dig

- `"#" * n` ger en stapel av `n` tecken, och `//` delar heltal så att staplarna blir lagom långa.
- Räkna ut talen först, rita sedan.
- Riktiga diagram görs med bibliotek, men tänket är detsamma.
