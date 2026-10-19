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

Datorn kan inte läsa svenska eller engelska. Den kan bara följa mycket enkla instruktioner, lagrade som ettor och nollor. **Python** är ett programmeringsspråk: ett sätt att skriva instruktioner som du kan läsa och skriva, och som Python gör om till sådant som datorn kan följa.

I koden ovan finns tre delar:

- `print` är en **funktion**. Det betyder "skriv ut", alltså "visa på skärmen".
- Parenteserna `( )` säger vad funktionen ska arbeta med.
- Texten står inom **citattecken**: `"Hej!"`.

Funktionen `print` har ett engelskt namn, men Python är inte engelska. Det är ett eget språk med förhållandevis få ord, som du lär dig ett i taget. I den här kursen förklarar vi varje ord första gången det dyker upp.

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
