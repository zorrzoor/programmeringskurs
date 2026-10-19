---
titel: Att få fel och att fastna
mal: Efter den här lektionen vet du att det är helt normalt att få fel, och vad du gör när du fastnar.
---

Hur lektionerna är uppbyggda och vad knapparna gör står på [startsidan](#/), under **Så använder du kursen**. Den hittar du alltid med länken **Programmeringskurs** högst upp.

## Fel är normala

Alla som programmerar får fel, varje dag. Ett felmeddelande är inte ett underkännande: det är Python som berättar vad den inte kan följa, och oftast var. Kör koden nedan och läs vad som står.

```python-exempel
print(Hej)
```

Felet säger att Python inte känner till namnet `Hej`. Python letar efter något som heter `Hej`, som om det vore något du har skapat tidigare. Det är ju bara en text, och texter ska stå inom citattecken.

## Din tur: rätta felet

```ovning
id: m0-kursen-ratta-felet
uppgift: "Koden har ett fel. Rätta det så att programmet skriver ut `Hej`."
start: |
  print(Hej)
ratta: {utdata: "Hej"}
ledtradar:
  - Läs felmeddelandet. Vilket ord känner Python inte till?
  - Hej är en text. Vad ska en text stå inom?
  - Sätt citattecken runt Hej, så att det står print("Hej").
facit: |
  print("Hej")
```

## Vad gör du om du fastnar?

```forutsag
kod: Du har fastnat på en uppgift. Vad är ett bra första steg?
kor: false
alternativ: ["Ge upp", "Läsa felmeddelandet och prova en ledtråd", "Starta om datorn"]
ratt: 1
forklaring: "Felmeddelandet och ledtrådarna finns där för att hjälpa dig. Att prova, få fel och prova igen är precis hur man lär sig."
```

## Det här lärde du dig

- Läs felmeddelandet: det säger vilken sorts fel det är och oftast var.
- Ledtrådarna och facit finns där för att hjälpa dig.
- Ett felmeddelande är en hjälp, och det är normalt att få dem.
