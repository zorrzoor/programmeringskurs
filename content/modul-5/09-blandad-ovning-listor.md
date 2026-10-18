---
titel: "Blandad övning: listor och uppslag"
mal: Efter den här lektionen har du övat listor, uppslag och loopar tillsammans.
---

## Innan du börjar

Modulens sammanfattning: uppgifter som blandar listor, uppslag, loopar och val. Använd **Stegvis** och ledtrådarna om du fastnar.

## Uppgifter

```ovning
id: m5-blandat-storst
uppgift: "Skriv ut det största talet i listan `tal`, utan att använda funktionen `max`. Gå igenom listan och håll koll på det största hittills."
start: |
  tal = [4, 17, 9, 12]
ratta: {utdata: "17"}
ledtradar:
  - Skapa en variabel för det största hittills, och starta den på det första elementet.
  - Jämför varje element med den, och byt ut den om elementet är större.
  - "storst = tal[0], for t in tal: if t > storst: storst = t, och print(storst) efter loopen."
facit: |
  tal = [4, 17, 9, 12]
  storst = tal[0]
  for t in tal:
      if t > storst:
          storst = t
  print(storst)
```

```ovning
id: m5-blandat-ordrakning
uppgift: "Räkna hur många gånger ordet `ja` förekommer i listan `svar`, och skriv ut antalet."
start: |
  svar = ["ja", "nej", "ja", "kanske", "ja"]
ratta: {utdata: "3"}
ledtradar:
  - Skapa en räknare som börjar på 0.
  - Gå igenom listan och öka räknaren när elementet är ja.
  - "antal = 0, for s in svar: if s == \"ja\": antal = antal + 1, och print(antal)."
facit: |
  svar = ["ja", "nej", "ja", "kanske", "ja"]
  antal = 0
  for s in svar:
      if s == "ja":
          antal = antal + 1
  print(antal)
```

```ovning
id: m5-blandat-medelvarde
uppgift: "Räkna ut medelvärdet av talen i listan `tal` (summan delad med antalet) och skriv ut det."
start: |
  tal = [4, 8, 6, 10]
ratta: {utdata: "7.0"}
ledtradar:
  - Du behöver summan av talen och antalet element.
  - Summera i en loop, och dela summan med len(tal).
  - "total = 0, for t in tal: total = total + t, och print(total / len(tal))."
facit: |
  tal = [4, 8, 6, 10]
  total = 0
  for t in tal:
      total = total + t
  print(total / len(tal))
```

## Det här lärde du dig i modulen

- Listor samlar värden på platser (från 0), uppslag på nycklar.
- En tabell är en lista av uppslag, och du går igenom den med `for`.
- Du kan summera, räkna, söka och välja ut i en lista med det du lärt dig i tidigare moduler.
