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

## Hur Python räknar

Python räknar på två sätt som kan kännas bakvända i början:

- **Starten ingår, slutet ingår inte.** `range(1, 5)` börjar på 1 och går tills den **kommer till** 5, men tar inte med 5. Det blir 1, 2, 3 och 4. Slutet är alltså där Python **stannar**, inte det sista värdet.
- **Räkningen börjar på 0** när du inte säger något annat: `range(5)` är samma sak som `range(0, 5)`, alltså 0, 1, 2, 3 och 4.

Varför är det så? Därför att antalet varv då alltid är **slut minus start**: `range(1, 5)` ger 5 - 1 = 4 varv, och `range(0, 5)` ger 5 varv. Dessutom passar delarna ihop utan glapp: `range(0, 5)` följt av `range(5, 10)` ger 0 till 9, och varje tal är med exakt en gång. Samma regler gäller för listor, som du får se i modul 5: plats 0 är det första elementet, och `lista[1:4]` slutar före plats 4.

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

```forutsag
kod: |
  antal = 0
  for i in range(2, 7):
      antal = antal + 1
  print(antal)
alternativ: ["4", "5", "6", "7"]
ratt: 1
forklaring: "range(2, 7) ger talen 2, 3, 4, 5 och 6, alltså fem varv. Det är slut minus start: 7 - 2 = 5. Slutet 7 tas inte med."
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
krav: ["anropa:range"]
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

- `range(start, slut, steg)`: slutet ingår aldrig. Antalet varv är slut minus start (när steget är 1).
- Utan start börjar den på 0, och utan steg är steget 1.
- Vill du ha talen 1 till och med 5 skriver du `range(1, 6)`.
