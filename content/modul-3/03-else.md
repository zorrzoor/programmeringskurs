---
titel: "Annars: else"
mal: Efter den här lektionen kan du låta ett program välja mellan två vägar med if och else.
---

## Prova först

Kör koden. Ändra `20` till `16` och kör igen.

```python-exempel
alder = 20
if alder >= 18:
    print("Du är myndig.")
else:
    print("Du är inte myndig än.")
```

## Så fungerar else

`else` betyder **annars**. Den kommer efter `if`, har ett kolon, och sedan raderna som ska köras när villkoret **inte** stämde. Ingen jämförelse behövs.

Exakt **en** av vägarna körs: antingen raderna under `if`, eller raderna under `else`. Aldrig båda, aldrig ingen.

```ruta
rubrik: Det här kan du från förut
text: |
  Det är hela `=OM(test; om sant; om falskt)` i Excel. Första delen efter OM är `if`, och den tredje delen är `else`.
```

## Förutsäg

```forutsag
kod: |
  x = 4
  if x > 5:
      print("A")
  else:
      print("B")
svar: "B"
forklaring: "4 är inte större än 5, så if-vägen hoppas över och else-vägen körs."
```

## Din tur

```ovning
id: m3-else-betyg
uppgift: "Variabeln `betyg` finns redan. Skriv ut `Godkänd` om `betyg` är minst 50, annars `Underkänd`."
start: |
  betyg = 40
ratta: {utdata: "Underkänd"}
ledtradar:
  - Du behöver både en if och en else.
  - else har inget villkor, bara ett kolon, och raderna under har indrag.
  - "if betyg >= 50: print(\"Godkänd\") och else: print(\"Underkänd\"), var sak på egna rader med indrag."
facit: |
  betyg = 40
  if betyg >= 50:
      print("Godkänd")
  else:
      print("Underkänd")
```

```ovning
id: m3-else-input
uppgift: "Be om ett tal med `int(input())` och skriv ut `Jämnt` om talet är jämnt (`tal % 2 == 0`) och annars `Udda`. Svaret som programmet får är `7`."
start: |
  # skriv din kod här
stdin: ["7"]
ratta: {utdata: "Udda"}
ledtradar:
  - Börja med att läsa in talet och göra om det till ett heltal.
  - "Jämnt betyder att resten vid delning med 2 är 0: tal % 2 == 0."
  - "tal = int(input()), sedan if tal % 2 == 0: print(\"Jämnt\") och else: print(\"Udda\")."
facit: |
  tal = int(input())
  if tal % 2 == 0:
      print("Jämnt")
  else:
      print("Udda")
```

## Det här lärde du dig

- `else` är vägen som körs när `if` inte stämde.
- Exakt en av vägarna körs.
- `%` ger resten vid delning och är bra för att se om ett tal är jämnt.
