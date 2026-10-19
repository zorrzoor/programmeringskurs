---
titel: Summera i en loop
mal: Efter den här lektionen kan du räkna ihop något i en loop med en variabel som växer för varje varv.
---

## Prova först

Kör koden, och tryck sedan på **Stegvis** och gå fram med **Nästa**. Titta på `total` i rutan **Variabler just nu**.

```python-exempel
total = 0
for i in range(1, 5):
    total = total + i
print(total)
```

Resultatet är 10, alltså 1 + 2 + 3 + 4. Talet 5 kommer inte med, eftersom `range(1, 5)` slutar före 5.

## Mönstret

Det här är ett av de vanligaste mönstren i programmering. Det har tre delar:

1. **Skapa** en variabel med startvärdet (här `total = 0`) *före* loopen.
2. **Uppdatera** den i loopen (`total = total + i`), en gång per varv.
3. **Skriv ut** den *efter* loopen, utan indrag, så att det görs en gång när allt är klart.

Du känner igen raden `total = total + i` från modul 2: ta det gamla värdet, lägg till något, lägg tillbaka.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel läggs en kolumn ihop med `=SUMMA(A1:A5)`. I Python byggs summan upp ett tal i taget. Det låter omständligt, men fungerar på allt som går att upprepa, inte bara tal i celler.
```

```forutsag
kod: |
  total = 0
  for i in range(3):
      total += 10
  print(total)
svar: "30"
forklaring: "Tre varv, och varje varv lägger på 10: 0, 10, 20, 30."
```

## Din tur

```ovning
id: m4-summera-tio
uppgift: "Summera talen från `1` till och med `10` i en loop, och skriv ut summan."
krav: ["loop"]
start: |
  # skriv din kod här
ratta: {utdata: "55"}
ledtradar:
  - Skapa en variabel som börjar på 0 före loopen.
  - Lägg till varje tal i variabeln inne i loopen, och skriv ut efter loopen.
  - "total = 0, for i in range(1, 11): total = total + i, och print(total) utan indrag."
facit: |
  total = 0
  for i in range(1, 11):
      total = total + i
  print(total)
```

```ovning
id: m4-summera-produkt
uppgift: "Räkna ut `1 * 2 * 3 * 4 * 5` i en loop (variabeln ska börja på `1`, inte `0`), och skriv ut resultatet."
krav: ["loop"]
start: |
  # skriv din kod här
ratta: {utdata: "120"}
ledtradar:
  - Samma mönster som en summa, men du multiplicerar.
  - Startvärdet ska vara 1, eftersom 0 gånger något blir 0.
  - "produkt = 1, for i in range(1, 6): produkt = produkt * i, och print(produkt) efter loopen."
facit: |
  produkt = 1
  for i in range(1, 6):
      produkt = produkt * i
  print(produkt)
```

## Det här lärde du dig

- Skapa en variabel före loopen, uppdatera den i loopen, skriv ut den efter.
- `total = total + i` bygger upp en summa varv för varv.
- Startvärdet är 0 för en summa och 1 för en produkt.
