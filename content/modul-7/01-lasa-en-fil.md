---
titel: Läsa en textfil
mal: Efter den här lektionen kan du öppna en fil och läsa innehållet, hela eller rad för rad.
---

Den här lektionen har en fil, `namn.txt`. Den följer med varje exempel och övning i lektionen, så du kan öppna den i koden.

```fil
namn: namn.txt
innehall: |
  Anna
  Bo
  Cia
  Dan
```

## Prova först

Kör koden. Ändra sedan filnamnet till något som inte finns och kör igen. Vad händer?

```python-exempel
with open("namn.txt", encoding="utf-8") as fil:
    text = fil.read()
print(text)
print(len(text))
```

## Så öppnar du en fil

`open("namn.txt", encoding="utf-8")` öppnar filen. Raden `with … as fil:` ser till att filen stängs när indraget är slut, även om något går fel. Inne i indraget kan du läsa:

- `fil.read()` ger **hela** innehållet som en enda text.
- Med en `for`-loop får du **en rad i taget**: `for rad in fil:`.

Varje rad slutar med ett radbyte (`\n`) som följer med. Det tar du bort med `.strip()`, som också tar bort mellanslag i början och slutet.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel öppnas en fil med Arkiv, Öppna, och programmet stänger den när du är klar. `with` gör det åt dig i Python. Skillnaden är att Python läser filen som rå text, utan kolumner och celler.
```

Om filen inte finns får du felet `FileNotFoundError`. Kontrollera stavningen, och att filen verkligen följer med i lektionen.

```forutsag
kod: |
  with open("namn.txt", encoding="utf-8") as fil:
      for rad in fil:
          print(rad.strip().upper())
alternativ: ["ANNA, BO, CIA, DAN, på varsin rad", "Anna Bo Cia Dan på en rad", "ANNA BO CIA DAN på en rad", "Ett felmeddelande"]
ratt: 0
forklaring: "Loopen tar en rad i taget. strip tar bort radbytet och upper gör bokstäverna stora, och print skriver varje namn på en egen rad."
```

## Din tur

```ovning
id: m7-lasa-antal-rader
uppgift: "Läs filen `namn.txt` rad för rad och skriv ut hur många rader den har."
start: |
  # skriv din kod här
ratta: {utdata: "4"}
ledtradar:
  - Öppna filen med with open(...), och gå igenom raderna med en for-loop.
  - Skapa en räknare före loopen och öka den för varje rad. Skriv ut den efter loopen.
  - "antal = 0, sedan with open(\"namn.txt\", encoding=\"utf-8\") as fil: och for rad in fil: antal = antal + 1, och print(antal) utan indrag."
facit: |
  antal = 0
  with open("namn.txt", encoding="utf-8") as fil:
      for rad in fil:
          antal = antal + 1
  print(antal)
```

```ovning
id: m7-lasa-hej
uppgift: "Skriv ut `Hej` följt av namnet, för varje namn i filen `namn.txt`, till exempel `Hej Anna`."
start: |
  # skriv din kod här
ratta: {utdata: "Hej Anna\nHej Bo\nHej Cia\nHej Dan"}
ledtradar:
  - Gå igenom filen rad för rad.
  - Använd rad.strip() så att radbytet inte följer med, och en f-sträng.
  - "print(f\"Hej {rad.strip()}\") inne i loopen."
facit: |
  with open("namn.txt", encoding="utf-8") as fil:
      for rad in fil:
          print(f"Hej {rad.strip()}")
```

## Det här lärde du dig

- `with open("fil.txt", encoding="utf-8") as fil:` öppnar och stänger en fil.
- `fil.read()` ger allt som text, och `for rad in fil:` ger en rad i taget.
- `.strip()` tar bort radbytet i slutet av raden.
