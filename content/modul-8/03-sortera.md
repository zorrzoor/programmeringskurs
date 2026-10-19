---
titel: Sortera och begränsa
mal: Efter den här lektionen kan du sortera resultatet och bara ta de första raderna.
---

Samma butik som förut.

Varje exempel och övning i lektionen börjar med samma sex rader: de skapar en liten databas i minnet från filen `butik.sql` och definierar funktionen `visa`, som kör en SQL-fråga och skriver ut varje rad. Du behöver bara skriva SQL-frågan inom citattecknen i `visa(...)`.

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

visa("SELECT namn, pris FROM varor ORDER BY pris")
```

Kör koden. I vilken ordning kommer varorna?

## ORDER BY och LIMIT

- `ORDER BY pris` sorterar stigande, och `ORDER BY pris DESC` fallande (descending).
- `LIMIT 2` tar bara de två första raderna. Tillsammans med `ORDER BY` blir det de två billigaste eller dyraste.
- Ordningen i frågan är fast: `SELECT`, `FROM`, `WHERE`, `ORDER BY`, `LIMIT`. (`JOIN`, `GROUP BY` och `HAVING` kommer i nästa lektioner, och hör hemma mellan dem.)

```ruta
rubrik: Du kanske känner igen det från databasprogram
text: |
  Det är samma sak som att sortera på en kolumn i en tabell, eller att välja topp 5 i en fråga.
```

```forutsag
kod: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor ORDER BY pris DESC LIMIT 2")
alternativ: ["juice, kaffe", "bulle, kaka", "kaffe, te", "juice, kaffe, te, kaka, bulle"]
ratt: 0
forklaring: "Sorterat på pris, dyrast först, är det juice (35) och kaffe (30). LIMIT 2 tar bara de två första."
```

## Din tur

```ovning
id: m8-sortera-namn
uppgift: "Skriv ut namnen på alla varor i bokstavsordning."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bulle\njuice\nkaffe\nkaka\nte"}
ledtradar:
  - Sortera på kolumnen namn.
  - ORDER BY namn.
  - visa("SELECT namn FROM varor ORDER BY namn")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor ORDER BY namn")
```

```ovning
id: m8-sortera-dyrast
uppgift: "Skriv ut namnet på den dyraste varan."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "juice"}
ledtradar:
  - Sortera med dyrast först, och ta bara en rad.
  - ORDER BY pris DESC och LIMIT 1.
  - visa("SELECT namn FROM varor ORDER BY pris DESC LIMIT 1")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor ORDER BY pris DESC LIMIT 1")
```

```ovning
id: m8-sortera-billigaste
uppgift: "Skriv ut namn och pris för de tre billigaste varorna, billigast först."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bulle 15\nkaka 20\nte 25"}
ledtradar:
  - Sortera stigande på pris, och begränsa till tre rader.
  - ORDER BY pris (stigande är standard) och LIMIT 3.
  - visa("SELECT namn, pris FROM varor ORDER BY pris LIMIT 3")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn, pris FROM varor ORDER BY pris LIMIT 3")
```

## Det här lärde du dig

- `ORDER BY kolumn` sorterar, och `DESC` vänder på ordningen.
- `LIMIT n` tar bara de första `n` raderna.
