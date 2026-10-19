---
titel: Så fungerar kursen
mal: Efter den här lektionen vet du hur du kör kod, får hjälp, och att det är helt normalt att få fel.
---

## Så här är varje lektion uppbyggd

1. **Prova.** Ett exempel som du kör och ändrar.
2. **Läs.** Några korta stycken som förklarar vad som hände.
3. **Test.** Du svarar på en fråga om vad som händer *innan* du kör. Det är det bästa sättet att lära sig.
4. **Övning.** Små uppgifter där du skriver koden.

Det finns inga poäng, ingen tid och ingen som tittar. Du kan gå tillbaka och göra om vad du vill.

## Knapparna

- **Kör** kör koden och visar resultatet.
- **Stoppa** avbryter ett program som inte tar slut.
- **Stegvis** visar vad som händer rad för rad och hur variablerna ändras. Du får använda den när du vill förstå varför ett program gör som det gör.
- **Kontrollera** (i uppgifter) säger om det du skrev stämmer, och var det skiljer sig om det inte gör det.
- **Ledtråd** ger en liten hjälp i taget, tre steg. Facit finns alltid, men du måste välja att visa det.
- **Börja om** sätter tillbaka den ursprungliga koden.

Din kod och dina framsteg sparas under ditt namn. Öppnar du kursen på en annan dator väljer du ditt namn, och du fortsätter där du var.

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

- Varje lektion: prova, läs, svara på en fråga, gör själv.
- Kör, Kontrollera, Ledtråd, Facit och Börja om hjälper dig.
- Ett felmeddelande är en hjälp, och det är normalt att få dem.
