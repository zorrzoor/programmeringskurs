---
titel: "Delar av en lista"
mal: "Efter den här lektionen kan du plocka ut de första, de sista eller en del av en lista, och göra en topplista."
---

## Prova först

Kör koden. Jämför vad som skrivs ut med listan.

```python-exempel
tal = [5, 12, 8, 3, 20, 7]
print(tal[1:4])
print(tal[:2])
print(tal[-2:])
print(tal[-1])
```

## Delar med hakparenteser

Med ett kolon i hakparentesen får du en **del** av listan:

- `lista[1:4]` är elementen från plats 1 till **före** plats 4, alltså plats 1, 2 och 3. (Slutet ingår inte, precis som i `range`: `lista[1:4]` ger 4 - 1 = 3 element.)
- `lista[:2]` är de **två första**, och `lista[2:]` är allt från plats 2 och framåt.
- Negativa tal räknar bakifrån: `lista[-1]` är det **sista** elementet och `lista[-2:]` de **två sista**.

Det fungerar också på text: `"Python"[:2]` är `"Py"`.

Tillsammans med `sorted` blir det en topplista: `sorted(tal, reverse=True)[:3]` är de tre största, eftersom `reverse=True` sorterar med störst först.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan du markera ett område, till exempel A2:A4. En del av en lista är samma idé, med en skillnad: i Excel ingår A4 i A2:A4, men i Python ingår slutet inte: `lista[2:4]` är plats 2 och 3.
```

## Fråga

```forutsag
kod: |
  namn = ["Anna", "Bo", "Cia", "Dan", "Eva"]
  print(namn[-3:])
kor: true
alternativ: ["['Cia', 'Dan', 'Eva']", "['Anna', 'Bo']", "['Dan', 'Eva']", "'Cia'"]
ratt: 0
forklaring: "-3: betyder de tre sista elementen: Cia, Dan och Eva. Resultatet är en lista, inte ett enda element."
```

## Din tur

```ovning
id: m5-delar-forsta
uppgift: "Listan `tal` finns redan. Skriv ut de tre första elementen som en lista."
start: |
  tal = [9, 4, 7, 1, 8, 6]
ratta: {"utdata": "[9, 4, 7]"}
ledtradar:
  - "Du vill ha en del av listan från början."
  - "tal[:3] ger de tre första."
  - "print(tal[:3])"
facit: |
  tal = [9, 4, 7, 1, 8, 6]
  print(tal[:3])
```

```ovning
id: m5-delar-storsta
uppgift: "Listan `tal` finns redan. Skriv ut de tre största talen som en lista, störst först."
start: |
  tal = [9, 4, 7, 1, 8, 6]
ratta: {"utdata": "[9, 8, 7]"}
ledtradar:
  - "Sortera först med störst först, och ta sedan de tre första."
  - "sorted(tal, reverse=True) sorterar fallande."
  - "print(sorted(tal, reverse=True)[:3])"
facit: |
  tal = [9, 4, 7, 1, 8, 6]
  print(sorted(tal, reverse=True)[:3])
```

```ovning
id: m5-delar-minsta
uppgift: "Listan `tal` finns redan. Skriv ut de tre minsta talen som en lista, minst först."
start: |
  tal = [9, 4, 7, 1, 8, 6]
ratta: {"utdata": "[1, 4, 6]"}
ledtradar:
  - "Sortera stigande, och ta de första tre."
  - "sorted(tal) sorterar stigande, och [:3] tar de tre första."
  - "print(sorted(tal)[:3])"
facit: |
  tal = [9, 4, 7, 1, 8, 6]
  print(sorted(tal)[:3])
```

## Det här lärde du dig

- `lista[a:b]` är en del av listan: från plats `a` till före plats `b`.
- `lista[:n]` är de `n` första, `lista[-n:]` de `n` sista och `lista[-1]` det sista.
- `sorted(lista, reverse=True)[:3]` är de tre största.
