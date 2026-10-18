---
titel: "Blandad övning: funktioner"
mal: Efter den här lektionen har du övat att skriva funktioner med parametrar och return, och att dela upp problem.
---

## Innan du börjar

Modulens sammanfattning. Alla uppgifter rättas genom att din funktion anropas med flera olika värden. Läs felmeddelandet och ledtrådarna om något inte stämmer.

## Uppgifter

```ovning
id: m6-blandat-ca-till-f
uppgift: "Skapa en funktion `celsius_till_fahrenheit(c)` som returnerar temperaturen i Fahrenheit: `c * 9 / 5 + 32`."
start: |
  # skriv din funktion här
ratta: {funktion: celsius_till_fahrenheit, tester: [{in: [0], ut: 32}, {in: [100], ut: 212}, {in: [-40], ut: -40}]}
ledtradar:
  - Funktionen får ett tal och returnerar ett tal.
  - Formeln är given i uppgiften.
  - "def celsius_till_fahrenheit(c): och return c * 9 / 5 + 32."
facit: |
  def celsius_till_fahrenheit(c):
      return c * 9 / 5 + 32
```

```ovning
id: m6-blandat-pris-med-rabatt
uppgift: "Skapa en funktion `pris_med_rabatt(pris)` som returnerar priset med 10 procents rabatt om priset är minst 500, annars oförändrat."
start: |
  # skriv din funktion här
ratta: {funktion: pris_med_rabatt, tester: [{in: [1000], ut: 900}, {in: [500], ut: 450}, {in: [499], ut: 499}]}
ledtradar:
  - Du behöver en if som jämför priset med 500.
  - 10 procents rabatt betyder att priset blir gånger 0.9.
  - "if pris >= 500: return pris * 0.9, och annars return pris."
facit: |
  def pris_med_rabatt(pris):
      if pris >= 500:
          return pris * 0.9
      return pris
```

```ovning
id: m6-blandat-ord
uppgift: "Skapa en funktion `antal_ord(text)` som returnerar hur många ord en text har. Tips: `text.split()` delar texten i en lista av ord."
start: |
  # skriv din funktion här
ratta: {funktion: antal_ord, tester: [{in: ["hej på dig"], ut: 3}, {in: ["ett"], ut: 1}, {in: ["a b c d e"], ut: 5}]}
ledtradar:
  - split() ger en lista, och len ger antalet element.
  - Du kan returnera antalet direkt.
  - "def antal_ord(text): och return len(text.split())."
facit: |
  def antal_ord(text):
      return len(text.split())
```

## Det här lärde du dig i modulen

- Funktioner har ett namn, parametrar och ibland ett `return`.
- Små funktioner kan användas av andra funktioner.
- Det finns många färdiga funktioner och moduler, och `import` hämtar dem.
