---
titel: "Flera val: elif"
mal: Efter den här lektionen kan du välja mellan fler än två vägar med elif, och vet att ordningen spelar roll.
---

## Prova först

Kör koden. Ändra `poang` till 95, 60 och 20 och kör igen.

```python-exempel
poang = 75
if poang >= 90:
    print("Mycket bra")
elif poang >= 70:
    print("Bra")
elif poang >= 50:
    print("Godkänd")
else:
    print("Underkänd")
```

## Så fungerar elif

`elif` är "annars om". Python provar villkoren **uppifrån och ned**. Det första som är sant körs, och sedan hoppar Python över resten. `else` sist fångar allt som inte passade.

Därför spelar **ordningen** roll: lägg det mest specifika (högsta betyget) först.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel går flera `OM` att lägga inuti varandra, vilket blir rörigt. `elif` är ett renare sätt att skriva en kedja av val. Prova **Stegvis** och se att Python slutar leta när ett villkor har stämt.
```

```forutsag
kod: |
  poang = 85
  if poang >= 90:
      print("Mycket bra")
  elif poang >= 70:
      print("Bra")
  else:
      print("Godkänd")
svar: "Bra"
forklaring: "85 är inte minst 90, men minst 70. Det andra villkoret är det första som stämmer, så Bra skrivs ut."
```

Nu en kedja i fel ordning. Vad händer?

```forutsag
kod: |
  poang = 95
  if poang >= 50:
      print("Godkänd")
  elif poang >= 90:
      print("Mycket bra")
svar: "Godkänd"
forklaring: "95 är minst 50, så det första villkoret stämmer och Python slutar leta. Mycket bra nås aldrig. Lägg det högsta först."
```

## Din tur

```ovning
id: m3-elif-temp
uppgift: "Variabeln `temp` finns redan. Skriv ut `Varmt` om `temp` är över 20, annars `Lagom` om den är över 10, annars `Kallt`."
start: |
  temp = 5
ratta: {utdata: "Kallt"}
ledtradar:
  - Du behöver if, elif och else, i den ordningen.
  - Börja med det varmaste villkoret (över 20), sedan över 10.
  - "if temp > 20: Varmt, elif temp > 10: Lagom, else: Kallt, var och en med indragen print."
facit: |
  temp = 5
  if temp > 20:
      print("Varmt")
  elif temp > 10:
      print("Lagom")
  else:
      print("Kallt")
```

```ovning
id: m3-elif-biljett
uppgift: "Be om en ålder med `int(input())`. Skriv ut `Gratis` om åldern är under 7, annars `Barn` om den är under 18, annars `Vuxen`. Svaret som programmet får är `12`."
start: |
  # skriv din kod här
stdin: ["12"]
ratta: {utdata: "Barn"}
ledtradar:
  - Läs in åldern som heltal och spara i en variabel.
  - Minsta gränsen först (under 7), sedan under 18, och else sist.
  - "alder = int(input()), sedan if alder < 7: ..., elif alder < 18: ..., else: ..."
facit: |
  alder = int(input())
  if alder < 7:
      print("Gratis")
  elif alder < 18:
      print("Barn")
  else:
      print("Vuxen")
```

## Det här lärde du dig

- `elif` ger fler vägar, och Python provar dem uppifrån och ned.
- Det första villkoret som stämmer körs, resten hoppas över.
- Ordningen spelar roll.
