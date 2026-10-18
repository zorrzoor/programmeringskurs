---
titel: En lista av poster
mal: "Efter den här lektionen kan du hantera en tabell: en lista där varje element är ett uppslag, och göra beräkningar på den."
---

## Prova först

Kör koden, och tryck gärna på **Stegvis**.

```python-exempel
personer = [
    {"namn": "Anna", "alder": 30},
    {"namn": "Bo", "alder": 25},
    {"namn": "Cia", "alder": 41},
]
for p in personer:
    print(p["namn"], p["alder"])
```

## En tabell i Python

Här har du en **lista av uppslag**. Varje uppslag är en rad (en person), och listan är hela tabellen. Så sparas nästan all verklig data: kunder, produkter, transaktioner.

Du går igenom raderna med en `for`-loop, och slår upp värdena i varje rad med nycklarna. Du kan summera, räkna och välja ut, precis som förut:

```python-exempel
personer = [{"namn": "Anna", "alder": 30}, {"namn": "Bo", "alder": 25}]
total = 0
for p in personer:
    total = total + p["alder"]
print(total / len(personer))
```

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det här liknar ett kalkylblad: en rad för varje post och en kolumn för varje nyckel. Skillnaden är att raderna går igenom i en loop, vilket också gör sådant möjligt som är svårt i Excel, till exempel att blanda olika regler.
```

## Förutsäg

```forutsag
kod: |
  varor = [{"namn": "kaffe", "pris": 30}, {"namn": "te", "pris": 25}]
  for v in varor:
      print(v["namn"])
alternativ: ["30 och 25", "kaffe och te", "kaffe, 30, te, 25", "namn och pris"]
ratt: 1
forklaring: "Loopen tar en vara i taget och skriver ut det som står under nyckeln namn."
```

## Din tur

```ovning
id: m5-poster-namn-over
uppgift: "Skriv ut namnen på alla personer som är äldre än `28`, ett per rad."
start: |
  personer = [
      {"namn": "Anna", "alder": 30},
      {"namn": "Bo", "alder": 25},
      {"namn": "Cia", "alder": 41},
  ]
ratta: {utdata: "Anna\nCia"}
ledtradar:
  - Gå igenom listan, och kontrollera åldern för varje person.
  - Använd if med p["alder"] > 28 och skriv ut p["namn"].
  - "for p in personer: if p[\"alder\"] > 28: print(p[\"namn\"])"
facit: |
  personer = [
      {"namn": "Anna", "alder": 30},
      {"namn": "Bo", "alder": 25},
      {"namn": "Cia", "alder": 41},
  ]
  for p in personer:
      if p["alder"] > 28:
          print(p["namn"])
```

```ovning
id: m5-poster-totalpris
uppgift: "Varje vara har ett `pris` och ett `antal`. Räkna ut och skriv ut vad allt kostar tillsammans (summan av `pris * antal`)."
start: |
  varor = [
      {"namn": "kaffe", "pris": 30, "antal": 2},
      {"namn": "te", "pris": 25, "antal": 4},
  ]
ratta: {utdata: "160"}
ledtradar:
  - Skapa en summavariabel före loopen och uppdatera den för varje vara.
  - Det varje vara kostar är pris gånger antal.
  - "total = 0, for v in varor: total = total + v[\"pris\"] * v[\"antal\"], och print(total) efter loopen."
facit: |
  varor = [
      {"namn": "kaffe", "pris": 30, "antal": 2},
      {"namn": "te", "pris": 25, "antal": 4},
  ]
  total = 0
  for v in varor:
      total = total + v["pris"] * v["antal"]
  print(total)
```

## Det här lärde du dig

- En tabell är en lista av uppslag: en rad per uppslag.
- Gå igenom raderna med `for`, och slå upp värden med nycklarna.
- Du kan summera, räkna och välja ut med det du redan kan.
