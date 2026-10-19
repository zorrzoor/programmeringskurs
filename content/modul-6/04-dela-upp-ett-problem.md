---
titel: Dela upp ett problem
mal: Efter den här lektionen kan du lösa ett problem genom att skriva flera små funktioner som använder varandra.
---

## Prova först

Kör koden. Notera hur varje funktion gör en enda sak.

```python-exempel
def summa(lista):
    total = 0
    for x in lista:
        total = total + x
    return total

def medel(lista):
    return summa(lista) / len(lista)

print(medel([4, 8, 6, 10]))
```

## Små funktioner som hjälps åt

Det mesta i programmering handlar om att dela upp ett stort problem i små delar, och ge varje del ett namn. Här gör `summa` en sak, och `medel` använder `summa` för att göra sin.

Fördelarna är tydliga:

- Varje funktion är liten och går att förstå på en gång.
- Du kan prova varje del för sig.
- Du slipper skriva samma kod flera gånger.

Hur delar du upp ett problem? Fråga dig: *vilka små steg skulle jag göra för hand?* Varje steg som går att namnge blir en funktion.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel byggs en stor beräkning ofta av flera celler som refererar till varandra, i stället för en enda lång formel. Varje cell är en liten, namngiven del. I Python är varje funktion en sådan del.
```

```forutsag
kod: |
  def dubbla(x):
      return x * 2

  def fyrdubbla(x):
      return dubbla(dubbla(x))

  print(fyrdubbla(3))
svar: "12"
forklaring: "dubbla(3) ger 6, och dubbla(6) ger 12. fyrdubbla använder dubbla två gånger."
```

## Din tur

```ovning
id: m6-dela-ar-jamnt
uppgift: "Skapa en funktion `ar_jamnt(tal)` som returnerar `True` om talet är jämnt och annars `False`."
start: |
  # skriv din funktion här
ratta: {funktion: ar_jamnt, tester: [{in: [4], ut: true}, {in: [7], ut: false}, {in: [0], ut: true}]}
ledtradar:
  - Ett tal är jämnt om resten vid delning med 2 är 0.
  - En jämförelse ger redan True eller False, så du kan returnera den direkt.
  - "def ar_jamnt(tal): och return tal % 2 == 0."
facit: |
  def ar_jamnt(tal):
      return tal % 2 == 0
```

```ovning
id: m6-dela-antal-jamna
uppgift: "Funktionen `ar_jamnt` finns redan. Skapa en funktion `antal_jamna(lista)` som returnerar hur många jämna tal det finns i listan, och använd `ar_jamnt` i den."
krav: ["funktion", "anropa:ar_jamnt"]
start: |
  def ar_jamnt(tal):
      return tal % 2 == 0
ratta: {funktion: antal_jamna, tester: [{in: [[1, 2, 3, 4]], ut: 2}, {in: [[5, 7]], ut: 0}, {in: [[2, 4, 6]], ut: 3}]}
ledtradar:
  - Gå igenom listan och räkna de tal som ar_jamnt säger är jämna.
  - Skapa en räknare före loopen och returnera den efter loopen.
  - "antal = 0, for t in lista: if ar_jamnt(t): antal = antal + 1, och return antal."
facit: |
  def ar_jamnt(tal):
      return tal % 2 == 0

  def antal_jamna(lista):
      antal = 0
      for t in lista:
          if ar_jamnt(t):
              antal = antal + 1
      return antal
```

## Det här lärde du dig

- Dela upp problem i små funktioner som var och en gör en sak.
- Funktioner kan anropa andra funktioner.
- En jämförelse ger `True` eller `False`, som du kan returnera direkt.
