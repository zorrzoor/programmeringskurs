---
titel: Och, eller, inte
mal: Efter den här lektionen kan du kombinera villkor med and, or och not.
---

## Prova först

Kör koden. Ändra värdena och kör igen.

```python-exempel
alder = 25
har_kort = True
if alder >= 18 and har_kort:
    print("Du får hyra bil.")
else:
    print("Du får inte hyra bil.")
```

## Tre ord

- `and` (och): båda villkoren måste stämma. `alder >= 18 and har_kort`.
- `or` (eller): minst ett av dem måste stämma. `dag == "lördag" or dag == "söndag"`.
- `not` (inte): vänder på svaret. `not har_kort` är sant om `har_kort` är falskt.

Du kan kombinera dem, och använda parenteser för att göra det tydligt.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel finns funktionerna `OCH()`, `ELLER()` och `INTE()`. De fungerar likadant: de får några villkor och ger tillbaka SANT eller FALSKT.
```

```forutsag
kod: |
  print(True and False)
svar: "False"
forklaring: "and kräver att båda är sanna. Här är det ena falskt, så svaret är False."
```

```forutsag
kod: |
  print(not False)
svar: "True"
forklaring: "not vänder på svaret: inte falskt är sant."
```

```forutsag
kod: |
  x = 7
  print(x > 5 or x < 0)
svar: "True"
forklaring: "or räcker med att ett villkor stämmer. 7 är större än 5, så svaret är True."
```

## Din tur

```ovning
id: m3-och-lagom
uppgift: "Variabeln `temp` finns redan. Skriv ut `Lagom` om `temp` är minst 10 och högst 20 (använd `and`), annars `Inte lagom`."
krav: ["and"]
start: |
  temp = 15
ratta: {utdata: "Lagom"}
ledtradar:
  - Du behöver två jämförelser som båda ska stämma.
  - Bind ihop dem med and i samma if-rad.
  - "if temp >= 10 and temp <= 20: Lagom, annars (else) Inte lagom."
facit: |
  temp = 15
  if temp >= 10 and temp <= 20:
      print("Lagom")
  else:
      print("Inte lagom")
```

```ovning
id: m3-eller-helg
uppgift: "Variabeln `dag` finns redan. Skriv ut `Helg` om `dag` är `lördag` eller `söndag` (använd `or`), annars `Vardag`."
krav: ["or"]
start: |
  dag = "lördag"
ratta: {utdata: "Helg"}
ledtradar:
  - Du behöver två jämförelser där minst en ska stämma.
  - Bind ihop dem med or.
  - "if dag == \"lördag\" or dag == \"söndag\": Helg, annars Vardag."
facit: |
  dag = "lördag"
  if dag == "lördag" or dag == "söndag":
      print("Helg")
  else:
      print("Vardag")
```

## Det här lärde du dig

- `and` kräver att båda stämmer, `or` att minst ett stämmer, och `not` vänder på svaret.
- Varje jämförelse skrivs fullständigt: `dag == "lördag" or dag == "söndag"`.
- Villkoren kan kombineras fritt.
