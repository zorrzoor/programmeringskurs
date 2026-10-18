---
titel: "Blandad övning: upprepning"
mal: Efter den här lektionen har du övat for, range, summering, while och val tillsammans.
---

## Innan du börjar

Modulens sammanfattning: uppgifter som blandar loopar med det du lärde dig om val. Använd **Stegvis** om du vill se vad koden gör, och ledtrådarna om du fastnar.

## Uppgifter

```ovning
id: m4-blandat-tabell
uppgift: "Skriv ut femmans multiplikationstabell, `5`, `10`, `15`, `20` och `25`, ett tal per rad, med en loop."
start: |
  # skriv din kod här
ratta: {utdata: "5\n10\n15\n20\n25"}
ledtradar:
  - Loopa fem varv och multiplicera räknaren med 5.
  - Använd range(1, 6) så att räknaren går från 1 till 5.
  - "for i in range(1, 6): och print(5 * i) med indrag."
facit: |
  for i in range(1, 6):
      print(5 * i)
```

```ovning
id: m4-blandat-jamna-summa
uppgift: "Summera alla jämna tal från `1` till och med `20` (alltså `2 + 4 + … + 20`) och skriv ut summan."
start: |
  # skriv din kod här
ratta: {utdata: "110"}
ledtradar:
  - Du behöver både en summa och ett villkor för att välja ut de jämna talen.
  - Ett tal är jämnt om resten vid delning med 2 är 0.
  - "total = 0, for i in range(1, 21): if i % 2 == 0: total = total + i, och print(total) efter loopen."
facit: |
  total = 0
  for i in range(1, 21):
      if i % 2 == 0:
          total = total + i
  print(total)
```

```ovning
id: m4-blandat-fizz
uppgift: "För varje tal från `1` till `15`: skriv ut `Fizz` om talet är delbart med 3, annars talet självt."
start: |
  # skriv din kod här
ratta: {utdata: "1\n2\nFizz\n4\n5\nFizz\n7\n8\nFizz\n10\n11\nFizz\n13\n14\nFizz"}
ledtradar:
  - Loopa över 1 till 15, och välj vad som ska skrivas ut för varje tal.
  - Delbart med 3 betyder i % 3 == 0.
  - "for i in range(1, 16): if i % 3 == 0: print(\"Fizz\"), annars (else) print(i)."
facit: |
  for i in range(1, 16):
      if i % 3 == 0:
          print("Fizz")
      else:
          print(i)
```

## Det här lärde du dig i modulen

- `for` och `range` upprepar ett bestämt antal gånger.
- Summera genom att skapa en variabel före loopen, uppdatera i loopen och skriva ut efter.
- `while` upprepar så länge ett villkor är sant, och `break` och `continue` styr loopen.
