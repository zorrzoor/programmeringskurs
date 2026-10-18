---
titel: "Blandad övning: val"
mal: Efter den här lektionen har du övat alla sorters val tillsammans, och kan ta dig an en uppgift som blandar dem.
---

## Innan du börjar

Det här är modulens sammanfattning: uppgifter som blandar det du har lärt dig om jämförelser, `if`, `else`, `elif` och `and`/`or`. Ta god tid på dig, använd ledtrådarna, och prova **Stegvis** om du vill se vad koden gör.

## Uppgifter

```ovning
id: m3-blandat-storst
uppgift: "Variablerna `a` och `b` finns redan. Skriv ut det största av dem."
start: |
  a = 8
  b = 12
ratta: {utdata: "12"}
ledtradar:
  - Du behöver jämföra a och b och välja en av dem.
  - Använd if och else.
  - "if a > b: print(a) och else: print(b), med indrag."
facit: |
  a = 8
  b = 12
  if a > b:
      print(a)
  else:
      print(b)
```

```ovning
id: m3-blandat-skottar
uppgift: "Variabeln `ar` finns redan. Skriv ut `Skottår` om året är delbart med 4 men inte med 100, eller om det är delbart med 400, annars `Inte skottår`."
start: |
  ar = 2024
ratta: {utdata: "Skottår"}
ledtradar:
  - "Delbart med 4 betyder ar % 4 == 0."
  - "Du behöver and och or, och parenteser kring den första delen."
  - "if (ar % 4 == 0 and ar % 100 != 0) or ar % 400 == 0: Skottår, annars Inte skottår."
facit: |
  ar = 2024
  if (ar % 4 == 0 and ar % 100 != 0) or ar % 400 == 0:
      print("Skottår")
  else:
      print("Inte skottår")
```

```ovning
id: m3-blandat-rabatt
uppgift: "Be om ett belopp med `int(input())`. Är beloppet minst 1000 får kunden 10 procent rabatt, är det minst 500 får kunden 5 procent, annars ingen. Skriv ut rabatten i procent som ett tal (`10`, `5` eller `0`). Svaret som programmet får är `700`."
start: |
  # skriv din kod här
stdin: ["700"]
ratta: {utdata: "5"}
ledtradar:
  - Läs in beloppet, och använd en if-kedja.
  - Börja med den största gränsen (1000), sedan 500, och else för resten.
  - "belopp = int(input()), sedan if belopp >= 1000: print(10), elif belopp >= 500: print(5), else: print(0)."
facit: |
  belopp = int(input())
  if belopp >= 1000:
      print(10)
  elif belopp >= 500:
      print(5)
  else:
      print(0)
```

## Det här lärde du dig i modulen

- En jämförelse ger `True` eller `False`.
- `if`, `elif` och `else` väljer väg, och indraget visar vad som hör ihop.
- `and`, `or` och `not` kombinerar villkor.
