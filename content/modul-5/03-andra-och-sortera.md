---
titel: Ändra och sortera
mal: Efter den här lektionen kan du lägga till och ta bort element, sortera en lista och kolla om något finns i den.
---

## Prova först

Kör koden. Ändra och prova med egna värden.

```python-exempel
namn = ["Cia", "Anna"]
namn.append("Bo")
print(namn)
print(sorted(namn))
print("Anna" in namn)
```

## Det du kan göra med en lista

- `lista.append(x)` lägger till `x` sist.
- `lista.remove(x)` tar bort det första `x` som finns.
- `lista[1] = "ny"` byter ut ett element.
- `sorted(lista)` ger en ny, sorterad lista (den gamla ändras inte), och `lista.sort()` sorterar den gamla på plats.
- `x in lista` svarar `True` eller `False` på om `x` finns i listan.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel sorteras en kolumn med ett klick, och ett värde kan letas upp med `=LETARAD()`. `sorted` och `in` gör samma sak i kod: sorterar och söker i en lista.
```

```forutsag
kod: |
  tal = [3, 1, 2]
  tal.append(0)
  print(sorted(tal))
alternativ: ["[3, 1, 2, 0]", "[0, 1, 2, 3]", "[0, 3, 1, 2]", "[1, 2, 3]"]
ratt: 1
forklaring: "Först läggs 0 till sist, sedan sorteras listan från minst till störst."
```

```forutsag
kod: |
  frukt = ["äpple", "banan"]
  print("citron" in frukt)
svar: "False"
forklaring: "citron finns inte i listan, så svaret är False."
```

## Din tur

```ovning
id: m5-andra-lagg-till
uppgift: "Listan `tal` finns redan. Lägg till talet `4` sist, och skriv ut hela listan."
start: |
  tal = [1, 2, 3]
ratta: {utdata: "[1, 2, 3, 4]"}
ledtradar:
  - Det finns något färdigt för att lägga till sist i en lista.
  - Det heter append, och talet står inom parenteserna.
  - tal.append(4) och sedan print(tal).
facit: |
  tal = [1, 2, 3]
  tal.append(4)
  print(tal)
```

```ovning
id: m5-andra-sortera
uppgift: "Listan `tal` finns redan. Skriv ut den sorterad från minst till störst."
start: |
  tal = [5, 2, 9, 1]
ratta: {utdata: "[1, 2, 5, 9]"}
ledtradar:
  - Det finns en färdig funktion som sorterar.
  - Den heter sorted, och listan står inom parenteserna.
  - print(sorted(tal))
facit: |
  tal = [5, 2, 9, 1]
  print(sorted(tal))
```

```ovning
id: m5-andra-finns
uppgift: "Skriv ut `Finns` om namnet `Bo` finns i listan `namn`, annars `Finns inte`."
start: |
  namn = ["Anna", "Bo", "Cia"]
ratta: {utdata: "Finns"}
ledtradar:
  - Du behöver en if och ett villkor som kollar om något finns i en lista.
  - Villkoret skrivs med ordet in.
  - "if \"Bo\" in namn: print(\"Finns\") och else: print(\"Finns inte\")."
facit: |
  namn = ["Anna", "Bo", "Cia"]
  if "Bo" in namn:
      print("Finns")
  else:
      print("Finns inte")
```

## Det här lärde du dig

- `append` lägger till, `remove` tar bort, och `lista[i] = x` byter ut ett element.
- `sorted(lista)` sorterar, och `x in lista` kollar om något finns.
- Funktioner som `sorted` ändrar inte originalet, men `lista.sort()` gör det.
