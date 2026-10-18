---
titel: Parametrar
mal: Efter den här lektionen kan du skicka in värden till en funktion så att den kan göra något olika varje gång.
---

## Prova först

Kör koden. Ändra namnen i anropen och kör igen.

```python-exempel
def halsa(namn):
    print(f"Hej {namn}!")

halsa("Anna")
halsa("Bo")
```

## Så fungerar parametrar

Parentesen i definitionen, `def halsa(namn):`, kan innehålla en eller flera **parametrar**: namn på de värden som funktionen ska få. Inne i funktionen används `namn` som en vanlig variabel.

När du anropar funktionen skickar du in ett värde: `halsa("Anna")`. Värdet du skickar in kallas **argument**, och det hamnar i parametern.

- Flera parametrar skiljs åt med komma: `def addera(a, b):`.
- Ordningen spelar roll: det första argumentet hamnar i den första parametern.
- Parametrarna finns bara **inne i** funktionen.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel anger en formel som `=SUMMA(A1:A5)` vilka celler den ska räkna på. Områdena är argument, och formeln gör samma sak med dem varje gång.
```

```forutsag
kod: |
  def visa(pris, antal):
      print(pris * antal)

  visa(20, 3)
svar: "60"
forklaring: "20 hamnar i pris och 3 i antal, eftersom de kommer i den ordningen. Funktionen skriver ut 20 * 3."
```

## Din tur

```ovning
id: m6-param-pris
uppgift: "Skapa en funktion `visa_pris(pris)` som skriver ut `Priset är` och priset, med ` kr` efter. Anropa den med `25`. Det ska skrivas ut `Priset är 25 kr`."
start: |
  # skriv din kod här
ratta: {utdata: "Priset är 25 kr"}
ledtradar:
  - Funktionen har en parameter, och använder den i en utskrift.
  - Använd en f-sträng så att priset hamnar mitt i texten.
  - "def visa_pris(pris): med print(f\"Priset är {pris} kr\") indragen, och sedan visa_pris(25) utan indrag."
facit: |
  def visa_pris(pris):
      print(f"Priset är {pris} kr")

  visa_pris(25)
```

```ovning
id: m6-param-tva
uppgift: "Skapa en funktion `addera(a, b)` som skriver ut summan av `a` och `b`. Anropa den med `4` och `7`."
start: |
  # skriv din kod här
ratta: {utdata: "11"}
ledtradar:
  - Funktionen ska ha två parametrar, skilda med komma.
  - Skriv ut summan inne i funktionen.
  - "def addera(a, b): med print(a + b) indragen, och sedan addera(4, 7)."
facit: |
  def addera(a, b):
      print(a + b)

  addera(4, 7)
```

## Det här lärde du dig

- Parametrar är namn på värden som funktionen får: `def halsa(namn):`.
- Du skickar in värden (argument) när du anropar: `halsa("Anna")`.
- Flera parametrar skiljs med komma, och ordningen spelar roll.
