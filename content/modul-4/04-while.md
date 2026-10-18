---
titel: "Upprepa så länge: while"
mal: Efter den här lektionen kan du upprepa något så länge ett villkor är sant med while, och veta hur du undviker en loop som aldrig tar slut.
---

## Prova först

Kör koden. Tryck sedan på **Stegvis** och följ `n`.

```python-exempel
n = 3
while n > 0:
    print(n)
    n = n - 1
print("Klart!")
```

## Så fungerar while

`while` betyder **så länge som**. Python kontrollerar villkoret, kör raderna under om det är sant, kontrollerar igen, och så vidare, tills villkoret blir falskt.

- Använd `for` när du vet **hur många** varv det ska bli.
- Använd `while` när du bara vet **när** det ska sluta.

Viktigt: något i loopen måste **ändra** det villkoret handlar om. Här minskar `n` för varje varv, så villkoret `n > 0` blir falskt till slut. Glömmer du `n = n - 1` blir loopen aldrig klar. Då trycker du på **Stoppa**, och det är helt okej: det händer alla.

```ruta
rubrik: Tänk på ett recept
text: |
  En receptrad som "rör tills smeten är slät" säger inte hur många gånger du ska röra, bara när du ska sluta. `while` är samma sak: upprepa tills villkoret inte längre stämmer.
```

## Förutsäg

```forutsag
kod: |
  n = 10
  while n > 0:
      print(n)
      n = n - 4
alternativ: ["10, 6, 2", "10, 6, 2, -2", "6, 2", "10, 6"]
ratt: 0
forklaring: "Så länge n är större än 0 skrivs n ut och minskas med 4: 10, 6 och 2. Sedan blir n -2, villkoret är falskt och loopen slutar utan att -2 skrivs ut."
```

## Din tur

```ovning
id: m4-while-nedrakning
uppgift: "Räkna ner från `5` till `1` med en while-loop (ett tal per rad), och skriv sedan ut `Start!`."
start: |
  # skriv din kod här
ratta: {utdata: "5\n4\n3\n2\n1\nStart!"}
ledtradar:
  - Skapa en variabel som börjar på 5, och loopa så länge den är större än 0.
  - Skriv ut variabeln i loopen och minska den med 1 för varje varv.
  - "n = 5, while n > 0: print(n) och n = n - 1, och sist print(\"Start!\") utan indrag."
facit: |
  n = 5
  while n > 0:
      print(n)
      n = n - 1
  print("Start!")
```

```ovning
id: m4-while-dubbla
uppgift: "Börja med `x = 1` och dubbla `x` så länge det är högst 100. Skriv ut det första värdet som blir större än 100."
start: |
  x = 1
ratta: {utdata: "128"}
ledtradar:
  - Loopa så länge x är högst 100.
  - Dubbla x inne i loopen.
  - "while x <= 100: x = x * 2, och print(x) efter loopen."
facit: |
  x = 1
  while x <= 100:
      x = x * 2
  print(x)
```

## Det här lärde du dig

- `while villkor:` upprepar tills villkoret blir falskt.
- Något i loopen måste ändra det villkoret handlar om, annars tar den aldrig slut.
- Fastnar du i en loop som aldrig slutar: tryck på **Stoppa**.
