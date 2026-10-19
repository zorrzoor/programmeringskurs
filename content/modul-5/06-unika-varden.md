---
titel: "Unika värden"
mal: "Efter den här lektionen kan du ta bort dubbletter ur en lista och räkna hur många olika värden det finns."
---

## Prova först

Kör koden. Vilka namn finns kvar, och hur många är de?

```python-exempel
namn = ["Anna", "Bo", "Anna", "Cia", "Bo"]
unika = set(namn)
print(len(unika))
print(sorted(unika))
```

## Mängder

En **mängd** (`set`) är som en lista där varje värde bara kan finnas en gång. Du gör en mängd av en lista med `set(lista)`, och dubbletterna försvinner.

- `len(mangd)` ger antalet olika värden.
- En mängd har **ingen bestämd ordning**. Vill du ha en ordnad lista gör du `sorted(mangd)`.
- `x in mangd` kollar om ett värde finns, och är snabbt även i stora mängder.
- `mangd.add(x)` lägger till ett värde, men bara om det inte redan finns.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel finns Ta bort dubbletter under Data, och funktionen UNIK i nyare versioner. En mängd gör samma sak i Python: den behåller varje värde en gång.
```

## Fråga

```forutsag
kod: |
  bokstaver = set("banan")
  print(sorted(bokstaver))
kor: true
alternativ: ["['a', 'b', 'n']", "['a', 'a', 'a', 'b', 'n', 'n']", "['b', 'a', 'n']", "['a', 'n', 'b']"]
ratt: 0
forklaring: "Texten banan har bokstäverna b, a, n, a, n. Som mängd finns varje bokstav en gång: a, b och n. sorted ger dem i bokstavsordning."
```

## Din tur

```ovning
id: m5-unika-antal
uppgift: "Listan `stader` finns redan. Skriv ut hur många olika städer den innehåller."
start: |
  stader = ["Lund", "Malmö", "Lund", "Umeå", "Malmö", "Lund"]
ratta: {"utdata": "3"}
ledtradar:
  - "Gör en mängd av listan, så försvinner dubbletterna."
  - "len ger antalet element i mängden."
  - "print(len(set(stader)))"
facit: |
  stader = ["Lund", "Malmö", "Lund", "Umeå", "Malmö", "Lund"]
  print(len(set(stader)))
```

```ovning
id: m5-unika-lista
uppgift: "Listan `stader` finns redan. Skriv ut de olika städerna i bokstavsordning, en per rad."
start: |
  stader = ["Lund", "Malmö", "Lund", "Umeå", "Malmö", "Lund"]
ratta: {"utdata": "Lund\nMalmö\nUmeå"}
ledtradar:
  - "Mängden har ingen ordning, så sortera den."
  - "sorted(set(stader)) ger en sorterad lista utan dubbletter."
  - "for s in sorted(set(stader)): print(s)"
facit: |
  stader = ["Lund", "Malmö", "Lund", "Umeå", "Malmö", "Lund"]
  for s in sorted(set(stader)):
      print(s)
```

```ovning
id: m5-unika-ordning
uppgift: "Listan `tal` finns redan. Skriv ut en ny lista utan dubbletter, där varje värde står kvar på den plats där det först förekom. Det ska bli `[3, 1, 2]`."
start: |
  tal = [3, 1, 3, 2, 1]
ratta: {"utdata": "[3, 1, 2]"}
ledtradar:
  - "En mängd tappar ordningen, så du behöver en lista också. Använd mängden för att komma ihåg vad du har sett."
  - "Gå igenom listan, och lägg bara till värden som inte redan finns i mängden."
  - "if x not in sett: sett.add(x) och ny.append(x) i loopen, och print(ny) efteråt."
facit: |
  tal = [3, 1, 3, 2, 1]
  sett = set()
  ny = []
  for x in tal:
      if x not in sett:
          sett.add(x)
          ny.append(x)
  print(ny)
```

## Det här lärde du dig

- `set(lista)` tar bort dubbletter, och `len(set(lista))` ger antalet olika värden.
- En mängd har ingen bestämd ordning: använd `sorted(...)` för en ordnad lista.
- `x in mangd` och `mangd.add(x)` kollar och lägger till värden.
