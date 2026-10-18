---
titel: Vad är Python?
mal: Efter den här lektionen vet du vad Python är, och du har kört din första kod.
---

## Prova först

Tryck på **Kör** i rutan nedan och titta på resultatet.

```python-exempel
print("Hej!")
```

Resultatet visas under rutan. Nu har du kört ett program!

Du får ändra koden. Ändra texten mellan citattecknen till ditt namn, och kör igen.

## Vad hände?

Datorn förstår inte svenska och inte heller engelska. Den förstår bara ettor och nollor. **Python** är ett programmeringsspråk: ett sätt att skriva instruktioner som både du och datorn kan förstå. Python gör om det du skriver till något som datorn kan följa.

I koden ovan finns tre delar:

- `print` är ett **kommando**. Det betyder "skriv ut", alltså "visa på skärmen".
- Parenteserna `( )` säger vad kommandot ska arbeta med.
- Texten står inom **citattecken**: `"Hej!"`.

Kommandot `print` är ett engelskt ord, men Python är inte engelska. Det är ett språk med några hundra ord som du lär dig ett i taget. I den här kursen förklarar vi varje ord första gången det dyker upp.

## Förutsäg och prova

```forutsag
kod: |
  print("Hej, Anna!")
svar: "Hej, Anna!"
forklaring: "print skriver ut texten som står mellan citattecknen, utan själva citattecknen."
```

## Din tur

```ovning
id: m0-python-hej-varlden
uppgift: "Ändra texten så att programmet skriver ut `Hej, världen!` (med komma och utropstecken)."
start: |
  print("Hej!")
ratta: {utdata: "Hej, världen!"}
ledtradar:
  - Texten som skrivs ut är den som står mellan citattecknen.
  - Ändra det som står mellan citattecknen. Behåll citattecknen och parenteserna som de är.
  - Resultatet ska bli exakt Hej, världen! Titta noga på kommatecknet och utropstecknet.
facit: |
  print("Hej, världen!")
```

## Det här lärde du dig

- Python är ett språk för att skriva instruktioner till en dator.
- `print(...)` skriver ut något på skärmen.
- Text står inom citattecken.
