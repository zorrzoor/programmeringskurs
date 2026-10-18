---
titel: Välja rader med WHERE
mal: Efter den här lektionen kan du välja ut rader med WHERE.
---

Samma butik som förut, med tabellen `varor`.

Varje exempel och övning i lektionen börjar med samma fem rader: de skapar en liten databas i minnet från filen `butik.sql` och definierar funktionen `visa`, som kör en SQL-fråga och skriver ut varje rad. Du behöver bara skriva SQL-frågan inom citattecknen i `visa(...)`.

```fil
namn: butik.sql
innehall: |
  CREATE TABLE varor (id INTEGER PRIMARY KEY, namn TEXT, kategori TEXT, pris INTEGER);
  INSERT INTO varor VALUES (1, 'kaffe', 'dryck', 30);
  INSERT INTO varor VALUES (2, 'te', 'dryck', 25);
  INSERT INTO varor VALUES (3, 'bulle', 'bakverk', 15);
  INSERT INTO varor VALUES (4, 'kaka', 'bakverk', 20);
  INSERT INTO varor VALUES (5, 'juice', 'dryck', 35);
  CREATE TABLE ordrar (id INTEGER PRIMARY KEY, vara_id INTEGER, antal INTEGER);
  INSERT INTO ordrar VALUES (1, 1, 3);
  INSERT INTO ordrar VALUES (2, 2, 2);
  INSERT INTO ordrar VALUES (3, 1, 1);
  INSERT INTO ordrar VALUES (4, 3, 4);
  INSERT INTO ordrar VALUES (5, 2, 1);
  INSERT INTO ordrar VALUES (6, 4, 2);
```

## Prova först

```python-exempel
import sqlite3

db = sqlite3.connect(":memory:")
db.executescript(open("butik.sql", encoding="utf-8").read())

def visa(sql):
    for rad in db.execute(sql):
        print(*rad)

visa("SELECT namn, pris FROM varor WHERE pris > 20")
```

Kör koden. Vilka varor kostar mer än 20?

## WHERE

`WHERE` väljer **vilka rader** du vill ha, med ett villkor som i Python: `pris > 20`. Några skillnader mot Python:

- Likhet skrivs med **ett** likhetstecken: `kategori = 'dryck'`.
- Text står inom enkla citattecken (`'dryck'`). Eftersom hela frågan redan står inom dubbla citattecken i Python går det bra.
- Villkor kombineras med `AND`, `OR` och `NOT`.
- `namn LIKE 'k%'` betyder att namnet börjar med k (`%` är vad som helst).

```ruta
rubrik: Du kanske känner igen det från databasprogram
text: |
  Det är samma sak som ett **villkor** i en frågeruta i ett databasprogram, eller ett filter. Det är samma idé som `if` i Python, men tillämpad på alla rader i tabellen.
```

```forutsag
kod: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor WHERE kategori = 'bakverk'")
alternativ: ["bulle och kaka, på varsin rad", "kaffe, te och juice", "bakverk, bakverk", "Ett felmeddelande, för = ska vara =="]
ratt: 0
forklaring: "Villkoret väljer de rader där kategorin är bakverk: bulle och kaka. I SQL skrivs likhet med ett enda likhetstecken."
```

## Din tur

```ovning
id: m8-where-billiga
uppgift: "Skriv ut namnen på varor som kostar högst 25 kr, en per rad."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "te\nbulle\nkaka"}
ledtradar:
  - Du behöver ett villkor på kolumnen pris.
  - "Högst 25 betyder mindre än eller lika med: <=."
  - visa("SELECT namn FROM varor WHERE pris <= 25")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor WHERE pris <= 25")
```

```ovning
id: m8-where-och
uppgift: "Skriv ut namnen på drycker som kostar mindre än 35 kr."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "kaffe\nte"}
ledtradar:
  - "Två villkor ska gälla samtidigt: kategori och pris."
  - Förena dem med AND.
  - visa("SELECT namn FROM varor WHERE kategori = 'dryck' AND pris < 35")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor WHERE kategori = 'dryck' AND pris < 35")
```

```ovning
id: m8-where-like
uppgift: "Skriv ut namnen på varor som börjar på bokstaven k."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "kaffe\nkaka"}
ledtradar:
  - LIKE jämför text med ett mönster.
  - Mönstret för "börjar på k" är 'k%'.
  - visa("SELECT namn FROM varor WHERE namn LIKE 'k%'")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor WHERE namn LIKE 'k%'")
```

## Det här lärde du dig

- `WHERE villkor` väljer ut rader.
- Likhet skrivs med `=`, och text står inom enkla citattecken.
- `AND`, `OR` och `NOT` kombinerar villkor, och `LIKE 'k%'` matchar text som börjar på k.
