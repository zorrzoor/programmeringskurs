---
titel: "Blandad övning: fler verktyg"
mal: "Efter den här lektionen har du övat Counter, text, datum och mönster tillsammans."
---

## Uppgifter

Alla uppgifter använder något av det du har lärt dig i modulen. Slå upp i lektionerna om du glömt hur något gjordes.

```ovning
id: m10-blandat-vanligast
uppgift: "Skriv ut det ord som förekommer flest gånger i texten."
start: |
  from collections import Counter

  text = "ett ord och ett ord och ett annat"
ratta: {"utdata": "ett"}
ledtradar:
  - "Dela texten i ord och räkna dem."
  - "Counter(...).most_common(1) ger det vanligaste ordet som ett par i en lista."
  - "print(Counter(text.split()).most_common(1)[0][0])"
facit: |
  from collections import Counter

  text = "ett ord och ett ord och ett annat"
  print(Counter(text.split()).most_common(1)[0][0])
```

```ovning
id: m10-blandat-dagar
uppgift: "Skriv ut hur många dagar det är från `2026-10-01` till varje datum i listan, på formen `2026-10-18: 17 dagar`, ett per rad."
start: |
  from datetime import date

  start = date(2026, 10, 1)
  datum = ["2026-10-18", "2026-12-24"]
ratta: {"utdata": "2026-10-18: 17 dagar\n2026-12-24: 84 dagar"}
ledtradar:
  - "Gå igenom listan, och gör varje text till ett datum."
  - "date.fromisoformat(d) - start ger tidsskillnaden, och .days är antalet dagar."
  - "print(f\"{d}: {(date.fromisoformat(d) - start).days} dagar\") i loopen."
facit: |
  from datetime import date

  start = date(2026, 10, 1)
  datum = ["2026-10-18", "2026-12-24"]
  for d in datum:
      print(f"{d}: {(date.fromisoformat(d) - start).days} dagar")
```

```ovning
id: m10-blandat-telefon
uppgift: "Skriv en funktion `bara_siffror(text)` som returnerar texten med alla tecken som inte är siffror borttagna, till exempel `070-123 45 67` blir `0701234567`."
start: |
  import re

  # skriv din funktion här
ratta: {"funktion": "bara_siffror", "tester": [{"in": ["070-123 45 67"], "ut": "0701234567"}, {"in": ["abc"], "ut": ""}, {"in": ["+46 8 123"], "ut": "468123"}]}
ledtradar:
  - "Byt ut allt som inte är en siffra mot ingenting."
  - "\\D är något som inte är en siffra, och ingenting är en tom text."
  - "return re.sub(r\"\\D\", \"\", text)"
facit: |
  import re

  def bara_siffror(text):
      return re.sub(r"\D", "", text)
```

## Det här lärde du dig

- `Counter` räknar, text har många färdiga metoder, `datetime` räknar med datum och `re` söker mönster.
- Slå upp ett verktyg när du behöver det: du behöver inte kunna allt utantill.
- Att läsa dokumentationen är en del av att programmera.
