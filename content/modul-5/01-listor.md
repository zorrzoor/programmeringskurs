---
titel: Listor
mal: Efter den här lektionen kan du skapa en lista, hämta ett element ur den och se hur lång den är.
---

## Prova först

Kör koden. Ändra ett av namnen och kör igen.

```python-exempel
namn = ["Anna", "Bo", "Cia"]
print(namn)
print(namn[0])
print(len(namn))
```

## Vad är en lista?

En **lista** samlar flera värden under ett namn. Den skrivs med hakparenteser, och värdena skiljs åt med kommatecken: `["Anna", "Bo", "Cia"]`.

- Varje värde i listan har en **plats**, och platserna räknas från **noll**: `namn[0]` är det första, `namn[1]` det andra.
- `len(namn)` ger **antalet** element, här 3.
- Det sista elementet är `namn[-1]`.
- En lista kan innehålla tal, text eller en blandning.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  En lista liknar en **kolumn** i Excel: flera värden under varandra. Skillnaden är att platserna numreras från 0, inte från 1, och att hela kolumnen har ett namn.
```

## Förutsäg

```forutsag
kod: |
  farger = ["röd", "grön", "blå"]
  print(farger[2])
svar: "blå"
forklaring: "Platserna räknas från noll: 0 är röd, 1 är grön och 2 är blå."
```

```forutsag
kod: |
  tal = [10, 20, 30, 40]
  print(len(tal))
svar: "4"
forklaring: "len ger antalet element, och det finns fyra."
```

## Din tur

```ovning
id: m5-listor-andra
uppgift: "Listan `frukt` finns redan. Skriv ut det andra elementet, alltså `banan`."
start: |
  frukt = ["äpple", "banan", "citron"]
ratta: {utdata: "banan"}
ledtradar:
  - Det andra elementet har inte plats 2.
  - Platserna räknas från noll, så det andra elementet har plats 1.
  - print(frukt[1])
facit: |
  frukt = ["äpple", "banan", "citron"]
  print(frukt[1])
```

```ovning
id: m5-listor-antal
uppgift: "Skapa en lista `tal` med talen `5`, `10`, `15` och `20`, och skriv ut hur många element den har."
start: |
  # skriv din kod här
ratta: {utdata: "4"}
ledtradar:
  - Skapa listan med hakparenteser och kommatecken, utan citattecken runt talen.
  - Antalet får du med len(...).
  - "tal = [5, 10, 15, 20] och print(len(tal))."
facit: |
  tal = [5, 10, 15, 20]
  print(len(tal))
```

## Det här lärde du dig

- En lista samlar flera värden: `["a", "b", "c"]`.
- Platserna räknas från 0, och `len(lista)` ger antalet.
- `lista[-1]` är det sista elementet.
