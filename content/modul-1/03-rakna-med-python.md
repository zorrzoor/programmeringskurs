---
titel: Räkna med Python
mal: Efter den här lektionen kan du använda Python som en miniräknare och veta i vilken ordning det räknas.
---

## Prova först

Kör koden. Ändra talen och räknesätten och kör igen.

```python-exempel
print(12 + 8)
print(12 - 8)
print(12 * 8)
print(12 / 8)
```

## Räknesätten

- `+` plus och `-` minus
- `*` gånger (en stjärna, inte ett x)
- `/` delat med (ger alltid ett tal med decimaler, som `1.5`)
- `**` upphöjt till, till exempel `2 ** 3` är 8
- `//` heltalsdelat (hur många gånger går det in?) och `%` rest, till exempel `7 // 2` är 3 och `7 % 2` är 1

Decimaltal skrivs med **punkt**, inte komma: `1.5`.

## I vilken ordning räknas det?

Precis som i matematiken: gånger och delat räknas före plus och minus, och parenteser räknas först av allt.

```python-exempel
print(2 + 3 * 4)
print((2 + 3) * 4)
```

```ruta
rubrik: Det här kan du från förut
text: |
  Du skriver formler i Excel på samma sätt: `=2+3*4` ger 14, och `=(2+3)*4` ger 20. Python följer samma räkneregler som
  Excel och en miniräknare.
```

## Förutsäg

```forutsag
kod: |
  print(2 + 3 * 4)
svar: "14"
forklaring: "Gånger räknas först: 3 * 4 är 12, sedan 2 + 12 är 14."
```

```forutsag
kod: |
  print(10 / 4)
svar: "2.5"
forklaring: "/ ger ett tal med decimaler. Python skriver decimaltal med punkt."
```

## Din tur

```ovning
id: m1-rakna-uttryck
uppgift: "Skriv ut vad `12 * 4 + 3` blir."
start: |
  # skriv din kod här
ratta: {utdata: "51"}
ledtradar:
  - Skriv uträkningen inom parenteserna på print, utan citattecken.
  - Räknesätten du behöver är * och +.
  - print(12 * 4 + 3)
facit: |
  print(12 * 4 + 3)
```

```ovning
id: m1-rakna-totalpris
uppgift: "Du köper 3 varor à 20 kr och betalar 10 kr i frakt. Skriv ut totalpriset med en uträkning, inte bara talet."
start: |
  # skriv din kod här
ratta: {utdata: "70"}
ledtradar:
  - Varorna kostar 3 gånger 20. Sedan tillkommer frakten.
  - Uträkningen är 3 * 20 + 10.
  - print(3 * 20 + 10)
facit: |
  print(3 * 20 + 10)
```

```ovning
id: m1-rakna-parentes
uppgift: "Skriv ut vad `(2 + 3) * 4` blir, alltså 20, med parenteser i uträkningen."
start: |
  # skriv din kod här
ratta: {utdata: "20"}
ledtradar:
  - Parenteser räknas först.
  - Parentesen ska ligga runt 2 + 3.
  - print((2 + 3) * 4)
facit: |
  print((2 + 3) * 4)
```

## Det här lärde du dig

- Python räknar med `+ - * /`, och även `**`, `//` och `%`.
- Gånger och delat räknas före plus och minus, och parenteser räknas först.
- Decimaltal skrivs med punkt.
