---
titel: Fråga användaren med input
mal: Efter den här lektionen kan du låta ett program fråga efter något och använda svaret.
---

## Prova först

Kör programmet. Det ställer en fråga. Skriv ditt svar i rutan som dyker upp och tryck Skicka.

```python-exempel
namn = input("Vad heter du? ")
print(f"Hej {namn}!")
```

## Så fungerar input

`input(...)` är ett kommando som **väntar på att någon skriver något**. Texten inom parenteserna visas som en fråga, och det som skrivs blir resultatet. Du sparar det i en variabel, här `namn`.

- Texten i `input("...")` är frågan. Den kan vara tom: `input()`.
- Svaret är **alltid text**, även om man skriver en siffra.
- Vill du räkna med svaret måste du göra om det till ett tal med `int(...)` (heltal) eller `float(...)` (decimaltal).

```python-exempel
alder = int(input("Hur gammal är du? "))
print(f"Nästa år fyller du {alder + 1}.")
```

`int(input("Hur gammal är du? "))` läses **inifrån och ut**: först körs `input(...)`, som ställer frågan och ger svaret som text, och sedan gör `int(...)` om den texten till ett tal. Det är samma sak som att göra det i två steg: `svar = input("Hur gammal är du? ")` och sedan `alder = int(svar)`.

Frågetexten i `input("...")` skrivs ut som en del av resultatet. Med `input("Vad heter du? ")` blir utskriften `Vad heter du? Hej Anna!` (frågan, och sedan det programmet skriver ut). Det måste du ta med om en uppgift ber om en exakt utskrift.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel finns dialogrutor och formulär där någon fyller i ett värde. `input` fungerar på samma sätt: programmet stannar, väntar på svar och går sedan vidare med det som skrevs.
```

Anta att någon svarar `5`.

```forutsag
kod: |
  svar = input()
  print(svar + svar)
stdin: ["5"]
svar: "55"
forklaring: "Svaret från input är text, så \"5\" och \"5\" sätts ihop till \"55\". Med int(input()) hade det blivit tal, och 5 + 5 hade blivit 10."
```

## Din tur

I uppgifterna ges svaren åt programmet automatiskt, så du behöver inte skriva något själv.

```ovning
id: m2-input-hej
uppgift: "Be om ett namn med `input()` (lämna parenteserna tomma) och skriv ut `Hej`, ett mellanslag, namnet och ett utropstecken. Svaret som programmet får är `Kalle`."
start: |
  # skriv din kod här
stdin: ["Kalle"]
ratta: {utdata: "Hej Kalle!"}
ledtradar:
  - Spara svaret från input() i en variabel.
  - Skriv ut med en f-sträng som innehåller variabeln.
  - namn = input() och print(f"Hej {namn}!")
facit: |
  namn = input()
  print(f"Hej {namn}!")
```

```ovning
id: m2-input-alder
uppgift: "Be om en ålder med `input()`, gör om svaret till ett heltal med `int()`, lägg till 1 och skriv ut resultatet. Svaret som programmet får är `30`, och utskriften ska bli `31`."
start: |
  # skriv din kod här
stdin: ["30"]
ratta: {utdata: "31"}
ledtradar:
  - Svaret från input är text. Du behöver göra om det till ett tal innan du räknar.
  - int(input()) ger ett heltal direkt.
  - alder = int(input()) och print(alder + 1)
facit: |
  alder = int(input())
  print(alder + 1)
```

## Det här lärde du dig

- `input()` väntar på ett svar och ger tillbaka det som text.
- Spara svaret i en variabel.
- `int(...)` gör om text till ett heltal, så att du kan räkna med det.
