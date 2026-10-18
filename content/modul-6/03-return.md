---
titel: Svara tillbaka med return
mal: Efter den här lektionen kan du låta en funktion ge ett svar tillbaka, och veta skillnaden mellan return och print.
---

## Prova först

Kör koden. Notera att funktionen *ger tillbaka* ett värde som du själv skriver ut.

```python-exempel
def dubbla(x):
    return x * 2

svar = dubbla(5)
print(svar)
print(dubbla(7) + 1)
```

## return är ett svar

`return` skickar ett värde **tillbaka** till dit funktionen anropades. Det går att spara i en variabel, räkna vidare på, eller skriva ut: `dubbla(7) + 1` blir `15`.

**Skillnaden mot `print`:** `print` skriver bara ut något på skärmen, och det går inte att använda värdet efteråt. `return` ger ett värde som du kan fortsätta arbeta med. När en funktion har kört `return` är den klar: raderna efter körs inte.

Om funktionen inte har något `return` ger anropet värdet `None`, som betyder "inget".

```ruta
rubrik: Det här kan du från förut
text: |
  En formel i Excel, som `=SUMMA(A1:A5)`, ger ett **svar** som du kan använda i en annan formel. En funktion med `return` fungerar likadant. En funktion som bara skriver ut är mer som ett makro som visar något.
```

## Förutsäg

```forutsag
kod: |
  def plus_ett(x):
      return x + 1

  print(plus_ett(plus_ett(3)))
svar: "5"
forklaring: "Den inre plus_ett(3) ger 4, och den yttre plus_ett(4) ger 5. Svaren från en funktion kan skickas vidare in i nästa."
```

## Din tur

Här rättas din funktion genom att den anropas med olika värden, och svaren jämförs.

```ovning
id: m6-return-dubbla
uppgift: "Skapa en funktion `dubbla(x)` som **returnerar** `x` gånger 2."
start: |
  # skriv din funktion här
ratta: {funktion: dubbla, tester: [{in: [2], ut: 4}, {in: [0], ut: 0}, {in: [-3], ut: -6}]}
ledtradar:
  - Funktionen ska ge tillbaka ett svar med return, inte skriva ut.
  - Svaret är parametern gånger 2.
  - "def dubbla(x): och på nästa rad, indragen, return x * 2."
facit: |
  def dubbla(x):
      return x * 2
```

```ovning
id: m6-return-moms
uppgift: "Skapa en funktion `moms(pris)` som returnerar momsen, alltså 25 procent av priset (`pris * 0.25`)."
start: |
  # skriv din funktion här
ratta: {funktion: moms, tester: [{in: [100], ut: 25}, {in: [200], ut: 50}, {in: [0], ut: 0}]}
ledtradar:
  - Funktionen ska returnera ett tal.
  - 25 procent är samma sak som gånger 0.25.
  - "def moms(pris): och return pris * 0.25."
facit: |
  def moms(pris):
      return pris * 0.25
```

```ovning
id: m6-return-storre
uppgift: "Skapa en funktion `storst(a, b)` som returnerar det största av de två talen."
start: |
  # skriv din funktion här
ratta: {funktion: storst, tester: [{in: [3, 7], ut: 7}, {in: [9, 2], ut: 9}, {in: [5, 5], ut: 5}]}
ledtradar:
  - Jämför a och b med en if, och returnera det ena eller andra.
  - Du kan ha två return, ett i if och ett i else.
  - "if a > b: return a, annars (else) return b."
facit: |
  def storst(a, b):
      if a > b:
          return a
      else:
          return b
```

## Det här lärde du dig

- `return värde` ger ett svar tillbaka, och funktionen är då klar.
- `print` skriver ut, `return` ger ett värde att arbeta vidare med.
- Utan `return` ger funktionen `None`.
