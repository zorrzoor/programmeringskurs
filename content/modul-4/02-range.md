---
titel: Styra range
mal: Efter den här lektionen kan du bestämma var range börjar, var den slutar och hur stora stegen är.
---

## Prova först

Kör koden. Ändra talen och kör igen.

```python-exempel
for i in range(3, 8):
    print(i)
```

```python-exempel
for i in range(0, 10, 2):
    print(i)
```

## Tre sätt att skriva range

- `range(5)`: från 0 till 4 (fem varv).
- `range(1, 6)`: från **1** till **5**. Första talet är starten, andra talet är **slutet som inte tas med**.
- `range(0, 10, 2)`: från 0, till men inte med 10, med **steg** 2: 0, 2, 4, 6, 8.

Slutvärdet ingår aldrig. Det är det vanligaste misstaget: vill du ha talen 1 till 5 skriver du `range(1, 6)`.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan en serie fyllas med start, steg och slutvärde. `range` gör samma sak, med skillnaden att slutet inte ingår.
```

```forutsag
kod: |
  for i in range(1, 4):
      print(i)
alternativ: ["1, 2, 3", "1, 2, 3, 4", "0, 1, 2, 3", "2, 3, 4"]
ratt: 0
forklaring: "range(1, 4) börjar på 1 och slutar före 4: talen 1, 2 och 3."
```

## Din tur

```ovning
id: m4-range-ett-till-fem
uppgift: "Skriv ut talen från `1` till och med `5`, ett per rad."
start: |
  # skriv din kod här
ratta: {utdata: "1\n2\n3\n4\n5"}
ledtradar:
  - Du behöver ange en start, och slutet ingår inte.
  - För att få med 5 ska slutet vara 6.
  - "for i in range(1, 6): och print(i) med indrag."
facit: |
  for i in range(1, 6):
      print(i)
```

```ovning
id: m4-range-jamna
uppgift: "Skriv ut de jämna talen `2`, `4`, `6`, `8` och `10`, ett per rad, med hjälp av steget i `range`."
start: |
  # skriv din kod här
ratta: {utdata: "2\n4\n6\n8\n10"}
ledtradar:
  - Börja på 2 och gå upp två åt gången.
  - Det tredje värdet i range är steget, och slutet 11 gör att 10 tas med.
  - "for i in range(2, 11, 2): och print(i) med indrag."
facit: |
  for i in range(2, 11, 2):
      print(i)
```

## Det här lärde du dig

- `range(start, slut, steg)`: slutet ingår aldrig.
- Utan start börjar den på 0, och utan steg är steget 1.
- Vill du ha talen 1 till och med 5 skriver du `range(1, 6)`.
