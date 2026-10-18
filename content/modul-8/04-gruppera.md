---
titel: Räkna och summera per grupp
mal: Efter den här lektionen kan du räkna, summera och ta medelvärden per grupp med GROUP BY.
---

Samma butik som förut.

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

visa("SELECT kategori, COUNT(*) FROM varor GROUP BY kategori")
```

Kör koden. Vad betyder talet på varje rad?

## Sammanfattande funktioner och GROUP BY

SQL har funktioner som räknar över flera rader: `COUNT(*)` (antal rader), `SUM(kolumn)` (summa), `AVG(kolumn)` (medelvärde), `MIN(kolumn)` och `MAX(kolumn)`.

`GROUP BY kolumn` delar upp raderna i grupper efter kolumnen, och funktionerna räknas ut **per grupp**. `HAVING` är som `WHERE`, men för grupper: `HAVING COUNT(*) > 2` behåller bara grupper med fler än två rader.

```ruta
rubrik: Du kanske känner igen det från databasprogram
text: |
  Det är en **pivottabell** eller en **summeringsfråga**: raderna grupperas efter ett fält, och en funktion räknas per grupp. Du gjorde samma sak med uppslag i modul 7, men här gör SQL det i en enda rad.
```

```forutsag
kod: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT kategori, MAX(pris) FROM varor GROUP BY kategori")
alternativ: ["bakverk 20, dryck 35, på varsin rad", "dryck 35, bakverk 20", "bakverk 35, dryck 20", "juice 35"]
ratt: 0
forklaring: "Grupperna kommer i bokstavsordning: bakverk, dryck. Det högsta priset bland bakverken är 20 (kaka) och bland dryckerna 35 (juice)."
```

## Din tur

```ovning
id: m8-grupp-summa
uppgift: "Skriv ut summan av priserna per kategori, på formen `bakverk 35`, i bokstavsordning."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bakverk 35\ndryck 90"}
ledtradar:
  - Gruppera på kategori och använd en summeringsfunktion.
  - SUM(pris) och GROUP BY kategori.
  - visa("SELECT kategori, SUM(pris) FROM varor GROUP BY kategori")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT kategori, SUM(pris) FROM varor GROUP BY kategori")
```

```ovning
id: m8-grupp-medel
uppgift: "Skriv ut medelpriset per kategori, på formen `bakverk 17.5`."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bakverk 17.5\ndryck 30.0"}
ledtradar:
  - Medelvärde heter AVG.
  - AVG(pris) och GROUP BY kategori.
  - visa("SELECT kategori, AVG(pris) FROM varor GROUP BY kategori")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT kategori, AVG(pris) FROM varor GROUP BY kategori")
```

```ovning
id: m8-grupp-having
uppgift: "Skriv ut de kategorier som har fler än två varor."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "dryck"}
ledtradar:
  - Gruppera på kategori, och filtrera grupperna, inte raderna.
  - Filtret på grupper heter HAVING.
  - visa("SELECT kategori FROM varor GROUP BY kategori HAVING COUNT(*) > 2")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT kategori FROM varor GROUP BY kategori HAVING COUNT(*) > 2")
```

## Det här lärde du dig

- `COUNT`, `SUM`, `AVG`, `MIN` och `MAX` räknar över flera rader.
- `GROUP BY kolumn` räknar per grupp, och `HAVING` filtrerar grupperna.
