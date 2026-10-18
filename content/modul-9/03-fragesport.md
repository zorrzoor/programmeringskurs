---
titel: "Projekt: frågesport"
mal: "Efter den här lektionen har du byggt en frågesport som ställer frågor, rättar svar och räknar poäng."
tid: 60
---

Du bygger en frågesport som ställer frågor, tar emot svar och räknar poäng. Frågorna är en lista med uppslag. Svaren från den som spelar kommer genom `input()`, och i övningarna får programmet färdiga svar så att rättningen vet vad som ska hända.

## Steg 1: En fråga

```ovning
id: m9-fraga-en
uppgift: "Skriv ut frågan `Vilken är Sveriges huvudstad?`, läs ett svar med `input()` och skriv ut `Rätt!` om svaret är `Stockholm`, annars `Fel!`."
start: |
  # skriv din kod här
stdin: ["Stockholm"]
ratta: {"utdata": "Vilken är Sveriges huvudstad?\nRätt!"}
ledtradar:
  - "Skriv ut frågan med print, och läs svaret med input()."
  - "Jämför svaret med \"Stockholm\" i en if, och använd else för fel."
  - "svar = input(), if svar == \"Stockholm\": print(\"Rätt!\"), else: print(\"Fel!\")."
facit: |
  print("Vilken är Sveriges huvudstad?")
  svar = input()
  if svar == "Stockholm":
      print("Rätt!")
  else:
      print("Fel!")
```

## Steg 2: Gör jämförelsen förlåtande

En spelare som skriver `stockholm ` med liten bokstav och ett mellanslag har rätt, men är inte exakt lika med `Stockholm`. Gör jämförelsen i en funktion som ignorerar stora och små bokstäver och mellanslag i början och slutet.

```ovning
id: m9-fraga-ratta
uppgift: "Skriv en funktion `ratta(svar, ratt)` som returnerar `True` om svaret är rätt och annars `False`. Stora och små bokstäver och mellanslag i början och slutet ska inte spela roll."
start: |
  # skriv din funktion här
ratta: {"funktion": "ratta", "tester": [{"in": ["stockholm ", "Stockholm"], "ut": true}, {"in": ["Göteborg", "Stockholm"], "ut": false}, {"in": ["4", "4"], "ut": true}]}
ledtradar:
  - "Gör båda texterna lika innan du jämför dem."
  - "strip() tar bort mellanslag i kanterna, och lower() gör små bokstäver."
  - "return svar.strip().lower() == ratt.strip().lower()"
facit: |
  def ratta(svar, ratt):
      return svar.strip().lower() == ratt.strip().lower()
```

## Steg 3: Alla frågor och poäng

Frågorna och funktionen `ratta` finns redan. Gå igenom alla frågor, ställ dem en i taget och räkna poäng.

```ovning
id: m9-fraga-alla
uppgift: "Ställ varje fråga med `print`, läs svaret med `input()` och skriv ut `Rätt!` eller `Fel!`. Räkna poäng, och skriv sist ut `Poäng: 1 av 2` (med dina egna poäng och antalet frågor)."
start: |
  # frågorna och funktionen ratta finns redan
  fragor = [
      {"fraga": "Vilken är Sveriges huvudstad?", "svar": "Stockholm"},
      {"fraga": "Vad är 2 + 2?", "svar": "4"},
  ]

  def ratta(svar, ratt):
      return svar.strip().lower() == ratt.strip().lower()
stdin: ["stockholm ", "5"]
ratta: {"utdata": "Vilken är Sveriges huvudstad?\nRätt!\nVad är 2 + 2?\nFel!\nPoäng: 1 av 2"}
ledtradar:
  - "Gå igenom fragor med en for-loop, och räkna poäng i en variabel som börjar på 0."
  - "Varje fråga är ett uppslag: f[\"fraga\"] och f[\"svar\"]."
  - "print(f[\"fraga\"]), svar = input(), if ratta(svar, f[\"svar\"]): ... poang = poang + 1, och en f-sträng sist."
facit: |
  fragor = [
      {"fraga": "Vilken är Sveriges huvudstad?", "svar": "Stockholm"},
      {"fraga": "Vad är 2 + 2?", "svar": "4"},
  ]

  def ratta(svar, ratt):
      return svar.strip().lower() == ratt.strip().lower()

  poang = 0
  for f in fragor:
      print(f["fraga"])
      svar = input()
      if ratta(svar, f["svar"]):
          print("Rätt!")
          poang = poang + 1
      else:
          print("Fel!")
  print(f"Poäng: {poang} av {len(fragor)}")
```

## Steg 4: Visa rätt svar

En bra frågesport berättar rätt svar när du har fel. Bygg vidare på ditt program från förra steget.

```ovning
id: m9-fraga-visa-ratt
uppgift: "Skriv ut `Fel! Rätt svar: ` följt av rätt svar när spelaren har fel (till exempel `Fel! Rätt svar: 4`). Allt annat är som i förra steget."
start: |
  fragor = [
      {"fraga": "Vilken är Sveriges huvudstad?", "svar": "Stockholm"},
      {"fraga": "Vad är 2 + 2?", "svar": "4"},
  ]

  def ratta(svar, ratt):
      return svar.strip().lower() == ratt.strip().lower()

  # skriv din kod här
stdin: ["Stockholm", "5"]
ratta: {"utdata": "Vilken är Sveriges huvudstad?\nRätt!\nVad är 2 + 2?\nFel! Rätt svar: 4\nPoäng: 1 av 2"}
ledtradar:
  - "Det är samma program som i steg 3, men med en annan text vid fel svar."
  - "Rätt svar finns i f[\"svar\"]."
  - "print(\"Fel! Rätt svar: \" + f[\"svar\"]) i else-grenen."
facit: |
  fragor = [
      {"fraga": "Vilken är Sveriges huvudstad?", "svar": "Stockholm"},
      {"fraga": "Vad är 2 + 2?", "svar": "4"},
  ]

  def ratta(svar, ratt):
      return svar.strip().lower() == ratt.strip().lower()

  poang = 0
  for f in fragor:
      print(f["fraga"])
      svar = input()
      if ratta(svar, f["svar"]):
          print("Rätt!")
          poang = poang + 1
      else:
          print("Fel! Rätt svar: " + f["svar"])
  print(f"Poäng: {poang} av {len(fragor)}")
```

## Förbättra själv

- Lägg till fler frågor, och ställ dem i slumpmässig ordning (modulen `random`, se lektionen om färdiga funktioner).
- Låt spelaren välja svar bland alternativ.
- Spara högsta poäng i en fil (modul 7).

## Det här lärde du dig

- En lista med uppslag är ett bra sätt att lagra frågor.
- En liten funktion (`ratta`) gör programmet lättare att läsa och ändra.
- `input()` ger programmet svar från den som spelar.
