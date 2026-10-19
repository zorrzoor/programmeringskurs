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

## Se vad som händer

Tryck på **Stegvis**. I tabellen visas texter med citattecken (`'Anna'`) och tal utan (`30`). Det är ett bra sätt att se vilken sort en variabel har.

## Samma regler som förut

- En text står inom citattecken: `"Anna"`.
- Ett tal står utan citattecken: `30`.
- Decimaltal skrivs med punkt: `12.5`.

Skillnaden märks när du använder `+`: tal räknas ihop, men texter sätts ihop till en längre text.

```python-exempel
a = "5"
b = 5
print(a + a)
print(b + b)
```

```forutsag
kod: |
  a = "Hej"
  b = "!"
  c = 3
  print(a + b)
  print(c + c)
alternativ: ["Hej! och 6", "Hej! och 33", "Hej och ! och 6", "Ett felmeddelande"]
ratt: 0
forklaring: "Plus mellan två texter sätter ihop dem (\"Hej\" och \"!\" blir \"Hej!\"). Plus mellan två tal räknar ihop dem (3 och 3 blir 6)."
```

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel går ett tal i en cell att summera, medan ett tal som är formaterat som text inte gör det. I Python avgör citattecknen vilket det är.
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
