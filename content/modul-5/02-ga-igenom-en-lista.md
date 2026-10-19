---
titel: Gå igenom en lista
mal: Efter den här lektionen kan du göra något med varje element i en lista med en for-loop.
---

## Prova först

Kör koden. Tryck sedan på **Stegvis** och följ `namn` genom varven.

```python-exempel
namnlista = ["Anna", "Bo", "Cia"]
for namn in namnlista:
    print(f"Hej {namn}!")
```

## Så fungerar det

Du kan låta en `for`-loop gå direkt igenom en lista: `for namn in namnlista:`. Variabeln `namn` får ett element i taget, i ordning, och raderna under körs en gång för varje element. Inget `range` och inga platsnummer behövs.

Det går lika bra med tal, och du kan kombinera med det du lärt dig förut, till exempel att summera:

```python-exempel
priser = [20, 35, 15]
total = 0
for pris in priser:
    total = total + pris
print(total)
```

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan samma sak göras med varje cell i en kolumn, till exempel summeras med `=SUMMA(A1:A3)`. I Python byggs summan upp i en loop, och vad som helst kan göras med varje värde.
```

```forutsag
kod: |
  tal = [1, 2, 3]
  for t in tal:
      print(t * 10)
alternativ: ["1, 2, 3", "10, 20, 30", "10, 10, 10", "60"]
ratt: 1
forklaring: "Loopen tar ett tal i taget och skriver ut det gånger 10: 10, 20 och 30."
```

## Din tur

```ovning
id: m5-ga-skriv-ut
uppgift: "Listan `frukt` finns redan. Skriv ut varje element på en egen rad med en for-loop."
krav: ["for"]
start: |
  frukt = ["äpple", "banan", "citron"]
ratta: {utdata: "äpple\nbanan\ncitron"}
ledtradar:
  - Använd for med en ny variabel som får ett element i taget.
  - Variabeln skrivs ut inne i loopen, med indrag.
  - "for f in frukt: och print(f) med indrag."
facit: |
  frukt = ["äpple", "banan", "citron"]
  for f in frukt:
      print(f)
```

```ovning
id: m5-ga-summa
uppgift: "Listan `poang` finns redan. Räkna ihop alla tal i en loop och skriv ut summan."
krav: ["loop"]
start: |
  poang = [12, 7, 20, 11]
ratta: {utdata: "50"}
ledtradar:
  - Skapa en variabel som börjar på 0 före loopen.
  - Lägg till varje element i variabeln inne i loopen.
  - "total = 0, for p in poang: total = total + p, och print(total) efter loopen."
facit: |
  poang = [12, 7, 20, 11]
  total = 0
  for p in poang:
      total = total + p
  print(total)
```

## Det här lärde du dig

- `for x in lista:` ger dig ett element i taget.
- Du kan summera, skriva ut eller välja bland elementen på samma sätt som med `range`.
- Variabelnamnet i loopen (här `namn`) bestämmer du själv.
