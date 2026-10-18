---
titel: "Blandad övning: SQL"
mal: Efter den här lektionen har du övat SELECT, WHERE, ORDER BY, GROUP BY och JOIN tillsammans.
---

## Innan du börjar

Samma butik och samma fem startrader som förut.

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

## Uppgifter

```ovning
id: m8-blandat-antal-drycker
uppgift: "Skriv ut hur många drycker butiken har."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "3"}
ledtradar:
  - Räkna rader med ett villkor på kategori.
  - COUNT(*) och WHERE kategori = 'dryck'.
  - visa("SELECT COUNT(*) FROM varor WHERE kategori = 'dryck'")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT COUNT(*) FROM varor WHERE kategori = 'dryck'")
```

```ovning
id: m8-blandat-dyraste-bakverk
uppgift: "Skriv ut namnet på det dyraste bakverket."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "kaka"}
ledtradar:
  - Välj bakverk först, sortera sedan och ta en rad.
  - WHERE kategori = 'bakverk', ORDER BY pris DESC och LIMIT 1.
  - visa("SELECT namn FROM varor WHERE kategori = 'bakverk' ORDER BY pris DESC LIMIT 1")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor WHERE kategori = 'bakverk' ORDER BY pris DESC LIMIT 1")
```

```ovning
id: m8-blandat-total
uppgift: "Skriv ut butikens totala omsättning: summan av antal gånger pris över alla ordrar."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "295"}
ledtradar:
  - Koppla ordrar till varor, och summera över alla rader.
  - SUM(ordrar.antal * varor.pris), utan GROUP BY.
  - visa("SELECT SUM(ordrar.antal * varor.pris) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT SUM(ordrar.antal * varor.pris) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id")
```

## Det här lärde du dig i modulen

- SQL frågar tabeller med `SELECT`, `FROM`, `WHERE`, `ORDER BY` och `LIMIT`.
- `GROUP BY` räknar per grupp, och `JOIN` kopplar ihop tabeller.
- Du kan köra SQL inifrån Python och bearbeta svaret med det du redan kan.
