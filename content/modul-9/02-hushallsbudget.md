---
titel: "Projekt: hushållsbudget"
mal: "Efter den här lektionen har du byggt ett litet budgetprogram i fem steg."
tid: 60
---

Du bygger ett program som summerar hushållets utgifter per kategori och visar vilka kategorier som gått över budget. Varje steg bygger på det förra, men har egen startkod, så att du kan göra dem i ordning.

Datan är en lista med utgifter, där varje utgift är ett uppslag med kategori och belopp, som i modul 5:

```python-exempel
utgifter = [
    {"kategori": "mat", "belopp": 2500},
    {"kategori": "hyra", "belopp": 9000},
    {"kategori": "mat", "belopp": 1200},
    {"kategori": "nöje", "belopp": 800},
    {"kategori": "transport", "belopp": 600},
]
print(len(utgifter), "utgifter")
```

## Steg 1: Summan av allt

```ovning
id: m9-budget-total
uppgift: "Skriv ut den totala summan av alla belopp i `utgifter`."
start: |
  # utgifterna finns redan
  utgifter = [
      {"kategori": "mat", "belopp": 2500},
      {"kategori": "hyra", "belopp": 9000},
      {"kategori": "mat", "belopp": 1200},
      {"kategori": "nöje", "belopp": 800},
      {"kategori": "transport", "belopp": 600},
  ]
ratta: {"utdata": "14100"}
ledtradar:
  - "Gå igenom listan och lägg ihop beloppen."
  - "Varje utgift är ett uppslag: u[\"belopp\"] ger beloppet."
  - "total = 0, for u in utgifter: total = total + u[\"belopp\"], och print(total) efteråt."
facit: |
  utgifter = [
      {"kategori": "mat", "belopp": 2500},
      {"kategori": "hyra", "belopp": 9000},
      {"kategori": "mat", "belopp": 1200},
      {"kategori": "nöje", "belopp": 800},
      {"kategori": "transport", "belopp": 600},
  ]
  total = 0
  for u in utgifter:
      total = total + u["belopp"]
  print(total)
```

## Steg 2: Summa per kategori

Nu gör du det till en funktion som summerar **per kategori** och svarar med ett uppslag. Det är mönstret från modul 7, fast på en lista i stället för en fil.

```ovning
id: m9-budget-per-kategori
uppgift: "Skriv en funktion `summa_per_kategori(utgifter)` som returnerar ett uppslag med kategorin som nyckel och summan av beloppen som värde."
start: |
  # skriv din funktion här
ratta: {"funktion": "summa_per_kategori", "tester": [{"in": [[{"kategori": "a", "belopp": 1}, {"kategori": "a", "belopp": 2}]], "ut": {"a": 3}}, {"in": [[{"kategori": "a", "belopp": 5}, {"kategori": "b", "belopp": 7}]], "ut": {"a": 5, "b": 7}}, {"in": [[]], "ut": {}}]}
ledtradar:
  - "Börja med ett tomt uppslag, och returnera det efter loopen."
  - "summor.get(k, 0) ger 0 om kategorin inte finns än."
  - "summor[k] = summor.get(k, 0) + u[\"belopp\"] inne i loopen."
facit: |
  def summa_per_kategori(utgifter):
      summor = {}
      for u in utgifter:
          k = u["kategori"]
          summor[k] = summor.get(k, 0) + u["belopp"]
      return summor
```

## Steg 3: Vilka kategorier har gått över budget?

```ovning
id: m9-budget-over
uppgift: "Skriv en funktion `over_budget(summor, budget)` som returnerar en lista, i bokstavsordning, med de kategorier där summan är **större** än budgeten. Både `summor` och `budget` är uppslag med kategorin som nyckel och ett tal som värde, till exempel `{\"mat\": 3700}`."
start: |
  # skriv din funktion här
ratta: {"funktion": "over_budget", "tester": [{"in": [{"mat": 10, "nöje": 20}, {"mat": 10, "nöje": 5}], "ut": ["nöje"]}, {"in": [{"a": 1}, {"a": 1}], "ut": []}, {"in": [{"b": 5, "a": 6}, {"b": 4, "a": 5}], "ut": ["a", "b"]}]}
ledtradar:
  - "Gå igenom kategorierna i summor och jämför med budget för samma kategori."
  - "Samla de som är över i en lista, och sortera den med sorted(...) när du returnerar."
  - "if summor[k] > budget[k]: lista.append(k), och return sorted(lista)."
facit: |
  def over_budget(summor, budget):
      lista = []
      for k in summor:
          if summor[k] > budget[k]:
              lista.append(k)
      return sorted(lista)
```

## Steg 4: Rapporten

Summorna och budgeten finns redan som uppslag i startkoden. Skriv ut en rad per kategori i bokstavsordning.

```ovning
id: m9-budget-rapport
uppgift: "Skriv ut en rad per kategori i bokstavsordning, på formen `hyra: 9000 av 9000`. Om summan är större än budgeten ska raden sluta med ` ÖVER`, till exempel `mat: 3700 av 3500 ÖVER`."
start: |
  # summorna och budgeten finns redan
  summor = {"mat": 3700, "hyra": 9000, "nöje": 800, "transport": 600}
  budget = {"mat": 3500, "hyra": 9000, "nöje": 500, "transport": 1000}
ratta: {"utdata": "hyra: 9000 av 9000\nmat: 3700 av 3500 ÖVER\nnöje: 800 av 500 ÖVER\ntransport: 600 av 1000"}
ledtradar:
  - "Gå igenom kategorierna i bokstavsordning med sorted(summor)."
  - "Bygg raden med en f-sträng, och lägg till ÖVER i en if om summan är större."
  - "rad = f\"{k}: {summor[k]} av {budget[k]}\", och if summor[k] > budget[k]: rad = rad + \" ÖVER\"."
facit: |
  summor = {"mat": 3700, "hyra": 9000, "nöje": 800, "transport": 600}
  budget = {"mat": 3500, "hyra": 9000, "nöje": 500, "transport": 1000}
  for k in sorted(summor):
      rad = f"{k}: {summor[k]} av {budget[k]}"
      if summor[k] > budget[k]:
          rad = rad + " ÖVER"
      print(rad)
```

## Steg 5: Sätt ihop allt

Nu har du alla delarna. Det sista steget är att använda dem tillsammans i ett helt program: utgifterna går in, funktionerna gör jobbet, och rapporten kommer ut.

```ovning
id: m9-budget-hela
uppgift: "Funktionerna `summa_per_kategori` och `over_budget` finns redan, och så `utgifter` och `budget`. Skriv ut rapporten från steg 4 (`hyra: 9000 av 9000`, med ` ÖVER` där summan är större än budgeten), men räkna ut summorna från `utgifter` med funktionen. Avsluta med en rad `Över budget: mat, nöje` med kategorierna som `over_budget` ger, åtskilda av komma."
start: |
  # funktionerna, utgifterna och budgeten finns redan
  def summa_per_kategori(utgifter):
      summor = {}
      for u in utgifter:
          k = u["kategori"]
          summor[k] = summor.get(k, 0) + u["belopp"]
      return summor

  def over_budget(summor, budget):
      lista = []
      for k in summor:
          if summor[k] > budget[k]:
              lista.append(k)
      return sorted(lista)

  utgifter = [
      {"kategori": "mat", "belopp": 2500},
      {"kategori": "hyra", "belopp": 9000},
      {"kategori": "mat", "belopp": 1200},
      {"kategori": "nöje", "belopp": 800},
      {"kategori": "transport", "belopp": 600},
  ]
  budget = {"mat": 3500, "hyra": 9000, "nöje": 500, "transport": 1000}
ratta: {"utdata": "hyra: 9000 av 9000\nmat: 3700 av 3500 ÖVER\nnöje: 800 av 500 ÖVER\ntransport: 600 av 1000\nÖver budget: mat, nöje"}
ledtradar:
  - "Börja med summor = summa_per_kategori(utgifter). Sedan är det samma loop som i steg 4."
  - "Sista raden: \", \".join(lista) sätter ihop kategorierna med komma emellan, och lista får du från over_budget(summor, budget)."
  - "print(\"Över budget: \" + \", \".join(over_budget(summor, budget)))"
facit: |
  def summa_per_kategori(utgifter):
      summor = {}
      for u in utgifter:
          k = u["kategori"]
          summor[k] = summor.get(k, 0) + u["belopp"]
      return summor

  def over_budget(summor, budget):
      lista = []
      for k in summor:
          if summor[k] > budget[k]:
              lista.append(k)
      return sorted(lista)

  utgifter = [
      {"kategori": "mat", "belopp": 2500},
      {"kategori": "hyra", "belopp": 9000},
      {"kategori": "mat", "belopp": 1200},
      {"kategori": "nöje", "belopp": 800},
      {"kategori": "transport", "belopp": 600},
  ]
  budget = {"mat": 3500, "hyra": 9000, "nöje": 500, "transport": 1000}

  summor = summa_per_kategori(utgifter)
  for k in sorted(summor):
      rad = f"{k}: {summor[k]} av {budget[k]}"
      if summor[k] > budget[k]:
          rad = rad + " ÖVER"
      print(rad)
  print("Över budget: " + ", ".join(over_budget(summor, budget)))
```

## Förbättra själv

När du är klar kan du fortsätta på egen hand:

- Räkna ut hur mycket som är kvar av budgeten per kategori.
- Läs utgifterna från en CSV-fil i stället för en lista (modul 7).
- Skriv rapporten till en fil.

## Det här lärde du dig

- Du delade upp ett program i små funktioner som hjälps åt.
- Uppslag och listor av uppslag är ett naturligt sätt att lagra tabelldata.
- Du kan bygga ett fungerande program steg för steg.
