---
titel: Tal och text i variabler
mal: Efter den här lektionen vet du att en variabel kan hålla både tal och text, och att det spelar roll vilket.
---

## Prova först

Kör koden. Ändra värdena och kör igen.

```python-exempel
namn = "Anna"
alder = 30
print(namn)
print(alder)
```

Båda variablerna skrivs ut på samma sätt, men de är olika sorter: `namn` är en **text** och `alder` är ett **tal**.

## Samma regler som förut

- En text står inom citattecken: `"Anna"`.
- Ett tal står utan citattecken: `30`.
- Decimaltal skrivs med punkt: `12.5`.

Skillnaden märks när du räknar. Ett tal kan du räkna med, men med en text blir det något annat.

```python-exempel
a = "5"
b = 5
print(a + a)
print(b + b)
```

## Förutsäg

```forutsag
kod: |
  a = "5"
  b = 5
  print(a + a)
  print(b + b)
alternativ: ["10 och 10", "55 och 10", "55 och 55", "Ett felmeddelande"]
ratt: 1
forklaring: "Plus mellan två texter sätter ihop dem (\"5\" och \"5\" blir \"55\"). Plus mellan två tal räknar ihop dem (5 och 5 blir 10)."
```

```ruta
rubrik: Det här kan du från förut
text: |
  Samma skillnad finns i Excel: ett tal i en cell går att summera, men ett tal som är formaterat som text gör det inte.
  I Python avgör citattecknen vilket det är.
```

## Din tur

```ovning
id: m2-tal-text-tre
uppgift: "Skapa tre variabler: `förnamn` med texten `Eva`, `antal` med talet `3` och `pris` med decimaltalet `12.5`."
start: |
  # skriv din kod här
ratta: {variabler: {förnamn: "Eva", antal: 3, pris: 12.5}}
ledtradar:
  - Tre rader, en variabel på varje.
  - Texten ska ha citattecken, talen inte. Decimaltal skrivs med punkt.
  - förnamn = "Eva", antal = 3 och pris = 12.5.
facit: |
  förnamn = "Eva"
  antal = 3
  pris = 12.5
```

```ovning
id: m2-tal-text-rakna
uppgift: "Variablerna `antal` och `pris` finns redan. Skriv ut vad alla varor kostar tillsammans, alltså `antal * pris`."
start: |
  antal = 4
  pris = 25
ratta: {utdata: "100"}
ledtradar:
  - Använd variablerna i en uträkning, inom print.
  - Gånger skrivs med *.
  - print(antal * pris)
facit: |
  antal = 4
  pris = 25
  print(antal * pris)
```

## Det här lärde du dig

- En variabel kan hålla tal eller text.
- Text har citattecken, tal har det inte.
- `+` räknar ihop tal men sätter ihop text.
