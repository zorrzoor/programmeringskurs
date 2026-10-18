---
titel: "Gruppera poster"
mal: "Efter den här lektionen kan du sortera in poster i grupper, så att varje grupp har en lista med sina poster."
---

## Prova först

Kör koden. Varje stad blir en nyckel, och värdet är en lista med de som bor där.

```python-exempel
personer = [
    {"namn": "Anna", "stad": "Lund"},
    {"namn": "Bo", "stad": "Umeå"},
    {"namn": "Cia", "stad": "Lund"},
    {"namn": "Dan", "stad": "Malmö"},
    {"namn": "Eva", "stad": "Umeå"},
]
grupper = {}
for p in personer:
    stad = p["stad"]
    if stad not in grupper:
        grupper[stad] = []
    grupper[stad].append(p["namn"])
print(grupper)
```

## Ett uppslag med listor

När du vill samla flera värden under samma nyckel låter du värdet vara en **lista**:

1. Om nyckeln inte finns än, skapa en tom lista: `grupper[stad] = []`.
2. Lägg till posten i gruppens lista med `.append(...)`.

En genväg för båda stegen är `grupper.setdefault(stad, []).append(namn)`: den skapar listan om den saknas och ger tillbaka den.

För att skriva ut en lista som text med ett tecken emellan använder du `", ".join(lista)`. Texten före `.join` är det som sätts mellan elementen: `", ".join(["Anna", "Cia"])` blir `"Anna, Cia"`. Elementen måste vara text.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det är samma sak som att sortera rader efter en kolumn och sedan titta på varje grupp för sig, som en pivottabell där varje grupp visar sina rader i stället för bara en summa.
```

## Fråga

```forutsag
kod: |
  grupper = {}
  for tal in [1, 2, 3, 4, 5, 6]:
      nyckel = "jamn" if tal % 2 == 0 else "udda"
      grupper.setdefault(nyckel, []).append(tal)
  print(grupper["udda"])
kor: true
alternativ: ["[1, 3, 5]", "[2, 4, 6]", "[1, 2, 3, 4, 5, 6]", "3"]
ratt: 0
forklaring: "Talen delas in efter om de är jämna eller udda. Gruppen udda får 1, 3 och 5. Det som skrivs ut är gruppens hela lista."
```

## Din tur

```ovning
id: m5-gruppera-skriv
uppgift: "Posterna i `personer` finns redan. Gruppera namnen per stad och skriv ut en rad per stad i bokstavsordning, på formen `Lund: Anna, Cia`."
start: |
  # personerna finns redan
  personer = [
      {"namn": "Anna", "stad": "Lund"},
      {"namn": "Bo", "stad": "Umeå"},
      {"namn": "Cia", "stad": "Lund"},
      {"namn": "Dan", "stad": "Malmö"},
      {"namn": "Eva", "stad": "Umeå"},
  ]
ratta: {"utdata": "Lund: Anna, Cia\nMalmö: Dan\nUmeå: Bo, Eva"}
ledtradar:
  - "Bygg ett uppslag med staden som nyckel och en lista med namn som värde."
  - "grupper.setdefault(p[\"stad\"], []).append(p[\"namn\"]) i loopen."
  - "Skriv ut med for stad in sorted(grupper): print(f\"{stad}: \" + \", \".join(grupper[stad]))."
facit: |
  personer = [
      {"namn": "Anna", "stad": "Lund"},
      {"namn": "Bo", "stad": "Umeå"},
      {"namn": "Cia", "stad": "Lund"},
      {"namn": "Dan", "stad": "Malmö"},
      {"namn": "Eva", "stad": "Umeå"},
  ]
  grupper = {}
  for p in personer:
      grupper.setdefault(p["stad"], []).append(p["namn"])
  for stad in sorted(grupper):
      print(f"{stad}: " + ", ".join(grupper[stad]))
```

```ovning
id: m5-gruppera-flest
uppgift: "Posterna i `personer` finns redan. Skriv ut namnet på den stad som har flest personer."
start: |
  # personerna finns redan
  personer = [
      {"namn": "Anna", "stad": "Lund"},
      {"namn": "Bo", "stad": "Umeå"},
      {"namn": "Cia", "stad": "Lund"},
      {"namn": "Dan", "stad": "Malmö"},
      {"namn": "Eva", "stad": "Umeå"},
  ]
ratta: {"utdata": "Lund"}
ledtradar:
  - "Gruppera först, och leta sedan upp gruppen med längst lista."
  - "len(grupper[stad]) är antalet personer i staden. Håll reda på den största hittills."
  - "if storst == \"\" or len(grupper[stad]) > len(grupper[storst]): storst = stad"
facit: |
  personer = [
      {"namn": "Anna", "stad": "Lund"},
      {"namn": "Bo", "stad": "Umeå"},
      {"namn": "Cia", "stad": "Lund"},
      {"namn": "Dan", "stad": "Malmö"},
      {"namn": "Eva", "stad": "Umeå"},
  ]
  grupper = {}
  for p in personer:
      grupper.setdefault(p["stad"], []).append(p["namn"])
  storst = ""
  for stad in grupper:
      if storst == "" or len(grupper[stad]) > len(grupper[storst]):
          storst = stad
  print(storst)
```

```ovning
id: m5-gruppera-funktion
uppgift: "Skriv en funktion `gruppera(poster, nyckel)` som returnerar ett uppslag där varje värde på `nyckel` är en nyckel, och värdet är en lista med `namn` från de poster som har det värdet."
start: |
  # skriv din funktion här
ratta: {"funktion": "gruppera", "tester": [{"in": [[{"namn": "A", "stad": "x"}, {"namn": "B", "stad": "y"}, {"namn": "C", "stad": "x"}], "stad"], "ut": {"x": ["A", "C"], "y": ["B"]}}, {"in": [[{"namn": "A", "klass": "1"}], "klass"], "ut": {"1": ["A"]}}, {"in": [[], "stad"], "ut": {}}]}
ledtradar:
  - "Det är samma mönster som förut, men nyckeln kommer från en parameter."
  - "p[nyckel] ger värdet som posten ska grupperas på."
  - "grupper.setdefault(p[nyckel], []).append(p[\"namn\"]), och return grupper."
facit: |
  def gruppera(poster, nyckel):
      grupper = {}
      for p in poster:
          grupper.setdefault(p[nyckel], []).append(p["namn"])
      return grupper
```

## Det här lärde du dig

- Ett uppslag med listor samlar flera värden under en nyckel: `grupper.setdefault(nyckel, []).append(x)`.
- `", ".join(lista)` sätter ihop en lista med text till en enda text.
- Det är samma mönster som "summa per grupp", men gruppen samlar poster i stället för en summa.
