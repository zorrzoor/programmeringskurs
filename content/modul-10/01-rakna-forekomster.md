---
titel: "Räkna förekomster"
mal: "Efter den här lektionen kan du räkna hur många gånger varje värde förekommer, och hitta det vanligaste."
---

## Prova först

Kör koden. Vilket ord förekommer oftast, och hur många gånger?

```python-exempel
from collections import Counter

ord = "en hund en katt en hund".split()
rakning = Counter(ord)
print(rakning)
print(rakning["hund"])
print(rakning.most_common(2))
```

## Counter

I modul 7 räknade du förekomster med ett uppslag och `.get(nyckel, 0) + 1`. Det är så vanligt att Python har en färdig variant: **`Counter`** från modulen `collections`.

- `Counter(lista)` räknar hur många gånger varje element förekommer, och ger ett uppslag med antalen.
- Frågar du efter ett värde som inte finns får du `0`, inte ett fel: `rakning["fisk"]` är `0`.
- `rakning.most_common(2)` är de två vanligaste, som en lista av par `(värde, antal)`, störst först. Utan siffra får du alla.

Text delas i ord med `text.split()`, som ger en lista med orden (mer om text i en senare lektion).

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det är som funktionen ANTAL.OM för varje värde samtidigt, eller en pivottabell som räknar antal rader per värde.
```

## Fråga

```forutsag
kod: |
  from collections import Counter

  r = Counter("banan")
  print(r["a"], r["x"])
kor: true
alternativ: ["2 0", "2 1", "3 0", "Ett felmeddelande"]
ratt: 0
forklaring: "Bokstaven a finns två gånger i banan. Bokstaven x finns inte, och Counter ger då 0 i stället för ett felmeddelande."
```

## Din tur

```ovning
id: m10-counter-antal
uppgift: "Listan `betyg` finns redan. Skriv ut hur många gånger betyget `A` förekommer."
start: |
  from collections import Counter

  betyg = ["A", "B", "A", "C", "A", "B"]
ratta: {"utdata": "3"}
ledtradar:
  - "Räkna med Counter, och slå upp antalet för A."
  - "Counter(betyg) ger ett uppslag, och [\"A\"] ger antalet."
  - "print(Counter(betyg)[\"A\"])"
facit: |
  from collections import Counter

  betyg = ["A", "B", "A", "C", "A", "B"]
  print(Counter(betyg)["A"])
```

```ovning
id: m10-counter-vanligaste
uppgift: "Skriv ut de två vanligaste orden i texten och hur många gånger de förekommer, på formen `en 3`, ett per rad."
start: |
  from collections import Counter

  text = "en hund och en katt och en fisk"
ratta: {"utdata": "en 3\noch 2"}
ledtradar:
  - "Dela texten i ord, räkna dem och ta de två vanligaste."
  - "Counter(text.split()).most_common(2) ger en lista av par."
  - "for ord, antal in Counter(text.split()).most_common(2): print(ord, antal)"
facit: |
  from collections import Counter

  text = "en hund och en katt och en fisk"
  for ord, antal in Counter(text.split()).most_common(2):
      print(ord, antal)
```

```ovning
id: m10-counter-funktion
uppgift: "Skriv en funktion `vanligast(lista)` som returnerar det värde som förekommer flest gånger i listan."
start: |
  from collections import Counter

  # skriv din funktion här
ratta: {"funktion": "vanligast", "tester": [{"in": [["a", "b", "a"]], "ut": "a"}, {"in": [[3, 3, 1, 1, 1]], "ut": 1}, {"in": [["x"]], "ut": "x"}]}
ledtradar:
  - "most_common(1) ger en lista med ett par: (värde, antal)."
  - "Det första paret är [0], och värdet är det första i paret: [0]."
  - "return Counter(lista).most_common(1)[0][0]"
facit: |
  from collections import Counter

  def vanligast(lista):
      return Counter(lista).most_common(1)[0][0]
```

## Det här lärde du dig

- `Counter(lista)` räknar hur många gånger varje värde förekommer.
- `rakning.most_common(n)` ger de `n` vanligaste som en lista av par (värde, antal).
- Ett värde som inte finns har antalet `0`.
