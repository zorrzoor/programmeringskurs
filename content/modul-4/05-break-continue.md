---
titel: Avbryta och hoppa över
mal: Efter den här lektionen kan du avbryta en loop med break och hoppa över ett varv med continue.
---

## Prova först

Kör koden. Ändra `3` till `5` och kör igen.

```python-exempel
for i in range(10):
    if i == 3:
        break
    print(i)
```

Loopen skulle gå till 9, men `break` avbröt den när `i` blev 3.

## Två kommandon

- `break` **avbryter** loopen direkt. Koden efter loopen körs sedan som vanligt.
- `continue` **hoppar över** resten av det här varvet och går vidare till nästa.

```python-exempel
for i in range(5):
    if i == 2:
        continue
    print(i)
```

Här hoppas varvet där `i` är 2 över, så talet 2 skrivs aldrig ut.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det liknar ett filter i Excel: med `continue` hoppas rader över som inte uppfyller ett villkor, och med `break` slutar loopen leta när det som söks är hittat.
```

```forutsag
kod: |
  for t in range(5, 10):
      if t > 7:
          break
      print(t)
alternativ: ["5, 6, 7", "5, 6, 7, 8", "6, 7", "5, 6, 7, 8, 9"]
ratt: 0
forklaring: "Loopen går igenom 5, 6 och 7 och skriver ut dem. Vid 8 körs break, så loopen slutar helt och 9 kommer aldrig med."
```

## Din tur

```ovning
id: m4-continue-hoppa
uppgift: "Skriv ut talen `1` till och med `10`, ett per rad, men hoppa över talet `5` med `continue`."
start: |
  # skriv din kod här
ratta: {utdata: "1\n2\n3\n4\n6\n7\n8\n9\n10"}
ledtradar:
  - Loopa över 1 till 10, och kontrollera om talet är 5.
  - Är talet 5 ska du hoppa över resten av varvet med continue.
  - "for i in range(1, 11): if i == 5: continue, och sedan print(i), alla med rätt indrag."
facit: |
  for i in range(1, 11):
      if i == 5:
          continue
      print(i)
```

```ovning
id: m4-break-stopp
uppgift: "Skriv ut talen från `1` och uppåt, men avbryt med `break` när talet blir större än `4`. Det ska bli `1`, `2`, `3` och `4`."
start: |
  # skriv din kod här
ratta: {utdata: "1\n2\n3\n4"}
ledtradar:
  - Loopa över ett stort område, till exempel range(1, 100).
  - Kontrollera om talet är större än 4 och avbryt då.
  - "for i in range(1, 100): if i > 4: break, och print(i) efter if-satsen."
facit: |
  for i in range(1, 100):
      if i > 4:
          break
      print(i)
```

## Det här lärde du dig

- `break` avbryter loopen helt.
- `continue` hoppar över resten av ett varv.
- Båda används oftast tillsammans med en `if`.
