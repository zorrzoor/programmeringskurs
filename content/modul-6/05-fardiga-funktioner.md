---
titel: Färdiga funktioner och moduler
mal: Efter den här lektionen kan du använda färdiga funktioner som sum, max och round, och hämta fler med import.
---

## Prova först

Kör koden. Du behöver inte skriva funktionerna: de finns redan i Python.

```python-exempel
tal = [4, 8, 6, 10]
print(sum(tal))
print(max(tal))
print(min(tal))
print(round(3.14159, 2))
print(abs(-5))
```

## Du behöver inte uppfinna allt själv

Python kommer med många färdiga funktioner. De vanligaste:

- `len(x)` ger antalet element, och `sum(lista)` summan av talen.
- `max(lista)` och `min(lista)` ger det största och minsta.
- `round(tal, n)` avrundar till `n` decimaler, och `abs(tal)` tar bort minustecknet.
- `sorted(lista)` sorterar.

Fler finns i **moduler**, färdiga samlingar som hämtas med `import`:

```python-exempel
import math
print(math.sqrt(16))
print(math.pi)
```

Efter `import math` når du modulens funktioner med punkt: `math.sqrt(16)` (kvadratroten ur 16). Det finns moduler för slumptal, datum, filer och mycket mer.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  `SUMMA`, `MAX` och `AVRUNDA` i Excel är färdiga funktioner: någon har gjort dem åt dig. (Pythons `round` avrundar exakt mitt emellan, som 2.5, till närmaste jämna tal: 2, inte alltid uppåt som i Excel.) Moduler liknar de tillägg i Excel som slås på för särskilda uppgifter.
```

```forutsag
kod: |
  tal = [3, 9, 1]
  print(max(tal) - min(tal))
svar: "8"
forklaring: "Det största är 9 och det minsta är 1, och 9 - 1 är 8."
```

## Din tur

```ovning
id: m6-fardiga-medel
uppgift: "Skriv ut medelvärdet av listan `tal` med hjälp av de färdiga funktionerna `sum` och `len`."
krav: ["anropa:sum", "anropa:len"]
start: |
  tal = [4, 8, 6, 10]
ratta: {utdata: "7.0"}
ledtradar:
  - Medelvärdet är summan delad med antalet.
  - sum ger summan och len ger antalet.
  - print(sum(tal) / len(tal))
facit: |
  tal = [4, 8, 6, 10]
  print(sum(tal) / len(tal))
```

```ovning
id: m6-fardiga-kvadratrot
uppgift: "Använd modulen `math` och skriv ut kvadratroten ur `25`."
krav: ["import:math"]
start: |
  # skriv din kod här
ratta: {utdata: "5.0"}
ledtradar:
  - Du behöver hämta modulen först.
  - "Skriv import math, och använd sedan math.sqrt(...)."
  - "import math och print(math.sqrt(25))."
facit: |
  import math
  print(math.sqrt(25))
```

## Det här lärde du dig

- Python har färdiga funktioner som `sum`, `max`, `min`, `round` och `abs`.
- `import modul` hämtar en modul, och du når dess funktioner med punkt: `math.sqrt(16)`.
- Kolla alltid om det redan finns en färdig funktion innan du skriver en egen.
