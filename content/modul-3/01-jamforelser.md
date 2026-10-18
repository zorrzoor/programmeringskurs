---
titel: "Ja eller nej: jämförelser"
mal: Efter den här lektionen kan du jämföra två värden i Python och veta att svaret är True eller False.
---

## Prova först

Kör koden. Ändra talen och kör igen.

```python-exempel
print(5 > 3)
print(5 == 3)
print(2 + 2 == 4)
```

Svaren är `True` (sant) eller `False` (falskt). Python har ställt en ja/nej-fråga och svarat.

## Så jämför du

- `==` är lika med
- `!=` är inte lika med
- `<` mindre än och `>` större än
- `<=` mindre än eller lika med, och `>=` större än eller lika med

Notera **två** likhetstecken när du jämför. Ett enda `=` betyder "spara i" (du känner igen det från variabler). Blandar du ihop dem får du ett fel eller ett oväntat resultat.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel ger `=A1>B1` svaret SANT eller FALSKT. I Python ger samma jämförelse `True` eller `False`. Det är samma sorts svar, och det är det som `if` använder för att välja väg i nästa lektion.
```

```forutsag
kod: |
  print(10 > 3)
svar: "True"
forklaring: "10 är större än 3, så svaret på frågan är True."
```

```forutsag
kod: |
  print("a" == "b")
svar: "False"
forklaring: "Texterna a och b är inte lika, så svaret är False."
```

```forutsag
kod: |
  print(3 != 4)
svar: "True"
forklaring: "3 är inte lika med 4, så != ger True."
```

## Din tur

```ovning
id: m3-jamfor-storre
uppgift: "Skriv ut om `7` är större än `5`."
start: |
  # skriv din kod här
ratta: {utdata: "True"}
ledtradar:
  - Skriv jämförelsen inom parenteserna på print.
  - Större än skrivs med tecknet >.
  - print(7 > 5)
facit: |
  print(7 > 5)
```

```ovning
id: m3-jamfor-alder
uppgift: "Variabeln `alder` finns redan. Skriv ut om `alder` är minst 18, alltså om `alder >= 18`."
start: |
  alder = 17
ratta: {utdata: "False"}
ledtradar:
  - Använd variabeln i jämförelsen, inom print.
  - Minst 18 betyder större än eller lika med 18.
  - print(alder >= 18)
facit: |
  alder = 17
  print(alder >= 18)
```

```ovning
id: m3-jamfor-namn
uppgift: "Variabeln `namn` finns redan. Skriv ut om `namn` är lika med `Anna`."
start: |
  namn = "Anna"
ratta: {utdata: "True"}
ledtradar:
  - Lika med skrivs med två likhetstecken, ==.
  - Texten Anna ska stå inom citattecken i jämförelsen.
  - print(namn == "Anna")
facit: |
  namn = "Anna"
  print(namn == "Anna")
```

## Det här lärde du dig

- En jämförelse ger `True` eller `False`.
- `==` jämför, `=` sparar.
- Jämförelserna är `== != < > <= >=`.
