---
titel: "Slumptal"
mal: "Efter den här lektionen kan du slumpa tal och val, och göra slumpen förutsägbar när du vill testa."
---

## Prova först

Kör koden flera gånger. Skriver den ut samma sak varje gång, och varför?

```python-exempel
import random

random.seed(1)
print(random.randint(1, 6))
print(random.randint(1, 6))
print(random.randint(1, 6))
```

## random

Modulen `random` ger slumpmässiga värden: till tärningar, lotterier och frågesporter.

- `random.randint(1, 6)` är ett heltal från 1 till 6, **båda inräknade**.
- `random.choice(lista)` är ett slumpmässigt element ur en lista.
- `random.shuffle(lista)` blandar listan på plats.

Datorn slumpar egentligen inte på riktigt: den räknar ut tal som ser slumpmässiga ut, utifrån ett startvärde. Med `random.seed(1)` bestämmer du startvärdet, och då blir **samma** tal slumpade varje gång. Det är så rättningen i kursen kan veta vad som ska skrivas ut. Utan `seed` hämtar Python startvärdet från datorn (till exempel från klockan), så talen blir olika varje gång. Det är precis vad du vill med en tärning, ett lotteri eller en blandad frågesport, och därför väljer man `random`. Med `seed` väljer du själv att få samma tal igen, till exempel när du testar. Det motsäger inte att samma instruktioner ger samma resultat: startvärdet är en del av indatan, och utan `seed` är den olika varje gång.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Excel har SLUMP() och SLUMP.MELLAN(1; 6), men de ändras varje gång arket räknas om. Med seed i Python kan du i stället få samma slumpade tal om igen.
```

## Fråga

```forutsag
kod: |
  import random

  random.seed(2)
  x = random.randint(1, 6)
  print(x >= 1 and x <= 6)
kor: true
alternativ: ["True", "False", "Det beror på", "Ett felmeddelande"]
ratt: 0
forklaring: "randint(1, 6) ger alltid ett heltal från 1 till 6, oavsett startvärde. Därför är jämförelsen alltid sann."
```

## Din tur

```ovning
id: m10-slump-tarning
uppgift: "Börja med `random.seed(42)` och skriv ut ett slumpat heltal från 1 till 100."
start: |
  import random
ratta: {"utdata": "82"}
ledtradar:
  - "Sätt startvärdet först, och slumpa sedan."
  - "random.randint(1, 100) ger talet."
  - "random.seed(42) och print(random.randint(1, 100))"
facit: |
  import random

  random.seed(42)
  print(random.randint(1, 100))
```

```ovning
id: m10-slump-val
uppgift: "Börja med `random.seed(7)` och skriv ut ett slumpat val ur listan `farger`."
start: |
  import random

  farger = ["röd", "grön", "blå"]
ratta: {"utdata": "grön"}
ledtradar:
  - "Sätt startvärdet, och välj sedan ur listan."
  - "random.choice(farger) väljer ett element."
  - "random.seed(7) och print(random.choice(farger))"
facit: |
  import random

  farger = ["röd", "grön", "blå"]
  random.seed(7)
  print(random.choice(farger))
```

```ovning
id: m10-slump-fem
uppgift: "Börja med `random.seed(3)` och skriv ut fem tärningskast (heltal 1 till 6), ett per rad."
start: |
  import random
ratta: {"utdata": "2\n5\n5\n2\n3"}
ledtradar:
  - "Upprepa fem gånger med en loop, och slumpa ett tal varje varv."
  - "for i in range(5): och random.randint(1, 6) inne i loopen."
  - "random.seed(3) före loopen, och print(random.randint(1, 6)) i den."
facit: |
  import random

  random.seed(3)
  for i in range(5):
      print(random.randint(1, 6))
```

```ovning
id: m10-slump-blanda
uppgift: "Börja med `random.seed(5)`, blanda listan `tal` med `random.shuffle` och skriv ut den."
start: |
  import random

  tal = [1, 2, 3, 4, 5]
ratta: {"utdata": "[1, 2, 4, 3, 5]"}
ledtradar:
  - "shuffle blandar listan på plats, och ger inget tillbaka."
  - "Anropa random.shuffle(tal) och skriv sedan ut tal."
  - "random.seed(5), random.shuffle(tal) och print(tal)"
facit: |
  import random

  tal = [1, 2, 3, 4, 5]
  random.seed(5)
  random.shuffle(tal)
  print(tal)
```

## Det här lärde du dig

- `random.randint(a, b)`, `random.choice(lista)` och `random.shuffle(lista)` ger slump.
- `random.seed(n)` gör att samma tal slumpas varje gång, vilket gör program lätta att testa.
- `randint` räknar med båda ändarna: `randint(1, 6)` kan ge både 1 och 6.
