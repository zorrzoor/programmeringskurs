---
titel: Summera per grupp
mal: Efter den här lektionen kan du summera en kolumn per grupp, till exempel total försäljning per vara.
---

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

Kör koden. Det är en summa per vara, byggd med ett uppslag.

```python-exempel
import csv

antal_per_vara = {}
with open("forsaljning.csv", encoding="utf-8") as fil:
    for rad in csv.DictReader(fil):
        vara = rad["vara"]
        if vara not in antal_per_vara:
            antal_per_vara[vara] = 0
        antal_per_vara[vara] = antal_per_vara[vara] + int(rad["antal"])

for vara, antal in antal_per_vara.items():
    print(vara, antal)
```

## Mönstret

Det här är ett av de vanligaste mönstren i dataprogram:

1. Skapa ett tomt uppslag: `summor = {}`.
2. För varje rad: ta ut gruppen (här varan). Om den inte finns i uppslaget än, börja på 0.
3. Lägg till värdet för raden till gruppens summa.
4. Gå igenom uppslaget och skriv ut resultatet med `.items()`, som ger nyckel och värde.

En genväg för steg 2 är `summor.get(vara, 0)`, som ger 0 om varan inte finns än: `summor[vara] = summor.get(vara, 0) + belopp`.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det här är samma sak som en **pivottabell**: raderna grupperas efter en kolumn, och en annan kolumn summeras för varje grupp. I Excel drar du fält till rutorna. I Python bygger du uppslaget själv, men kan göra det med vilka grupper och beräkningar du vill.
```

```forutsag
kod: |
  import csv

  rader_per_vara = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          v = rad["vara"]
          rader_per_vara[v] = rader_per_vara.get(v, 0) + 1
  print(rader_per_vara["te"], rader_per_vara["bulle"])
alternativ: ["2 1", "3 4", "2 4", "1 1"]
ratt: 0
forklaring: "Det finns två rader med te och en rad med bulle. Här räknas rader, inte antal sålda enheter."
```

## Din tur

```ovning
id: m7-grupp-omsattning
uppgift: "Räkna ut omsättningen (antal gånger pris) per vara och skriv ut den på formen `kaffe: 120`, en vara per rad, i den ordning varorna först förekommer i filen."
start: |
  import csv
ratta: {utdata: "kaffe: 120\nte: 75\nbulle: 60"}
ledtradar:
  - Bygg ett uppslag med varan som nyckel, och lägg till antal * pris för varje rad.
  - "summor[vara] = summor.get(vara, 0) + int(rad[\"antal\"]) * int(rad[\"pris\"])"
  - "Skriv sedan ut med for vara, summa in summor.items(): print(f\"{vara}: {summa}\")."
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])
  for vara, summa in summor.items():
      print(f"{vara}: {summa}")
```

```ovning
id: m7-grupp-basta
uppgift: "Skriv ut namnet på den vara som har högst omsättning (antal gånger pris, summerat per vara)."
start: |
  import csv
ratta: {utdata: "kaffe"}
ledtradar:
  - Börja med att räkna ut omsättningen per vara, precis som i förra uppgiften.
  - Gå sedan igenom uppslaget och håll reda på den vara som har störst summa.
  - "Du kan också använda max(summor, key=summor.get), som ger nyckeln med störst värde."
facit: |
  import csv

  summor = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          vara = rad["vara"]
          summor[vara] = summor.get(vara, 0) + int(rad["antal"]) * int(rad["pris"])
  print(max(summor, key=summor.get))
```

```ovning
id: m7-grupp-sorterat
uppgift: "Skriv ut antal sålda enheter per vara på formen `bulle: 4`, i bokstavsordning efter varans namn."
start: |
  import csv
ratta: {utdata: "bulle: 4\nkaffe: 4\nte: 3"}
ledtradar:
  - Räkna antal per vara i ett uppslag.
  - sorted(uppslag) ger nycklarna i bokstavsordning.
  - "for vara in sorted(antal): print(f\"{vara}: {antal[vara]}\")"
facit: |
  import csv

  antal = {}
  with open("forsaljning.csv", encoding="utf-8") as fil:
      for rad in csv.DictReader(fil):
          antal[rad["vara"]] = antal.get(rad["vara"], 0) + int(rad["antal"])
  for vara in sorted(antal):
      print(f"{vara}: {antal[vara]}")
```

## Det här lärde du dig

- Summera per grupp: ett uppslag med gruppen som nyckel och summan som värde.
- `uppslag.get(nyckel, 0)` ger 0 om nyckeln inte finns än.
- `.items()` ger nyckel och värde när du går igenom uppslaget.
