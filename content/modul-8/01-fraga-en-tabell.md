---
titel: Fråga en tabell
mal: Efter den här lektionen kan du hämta kolumner och rader från en tabell med SELECT.
---

Det här är en valfri modul. Du får använda **SQL**, språket för att fråga databaser, inifrån Python. Tabellerna `varor` och `ordrar` ligger i filen `butik.sql` (en butik med varor och beställningar).

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

visa("SELECT * FROM varor")
```

Kör koden. Varje rad är en vara: id, namn, kategori och pris.

## SELECT och FROM

`SELECT` anger **vilka kolumner** du vill ha, och `FROM` **vilken tabell**. Stjärnan `*` betyder alla kolumner. Du kan i stället räkna upp kolumner med komma emellan: `SELECT namn, pris FROM varor`. `SELECT DISTINCT kategori FROM varor` tar bort dubbletter.

SQL-ord brukar skrivas med versaler, men Python bryr sig inte om det.

```ruta
rubrik: Du kanske känner igen det från databasprogram
text: |
  Tabellen är som en tabell i ett databasprogram, och `SELECT` är som att skapa en fråga (en *query*) som väljer fält. Det som skiljer är att frågan här skrivs som text.
```

```forutsag
kod: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn FROM varor")
alternativ: ["kaffe, te, bulle, kaka, juice, på varsin rad", "dryck, dryck, bakverk, bakverk, dryck", "30, 25, 15, 20, 35", "Alla kolumner för varje vara"]
ratt: 0
forklaring: "SELECT namn ger bara kolumnen namn, en rad per vara i den ordning de ligger i tabellen."
```

## Din tur

```ovning
id: m8-select-kolumner
uppgift: "Skriv ut namn och pris för alla varor, till exempel `kaffe 30`, en vara per rad."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "kaffe 30\nte 25\nbulle 15\nkaka 20\njuice 35"}
ledtradar:
  - Du vill ha två kolumner från tabellen varor.
  - Skriv kolumnnamnen med komma emellan efter SELECT.
  - visa("SELECT namn, pris FROM varor")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT namn, pris FROM varor")
```

```ovning
id: m8-select-distinct
uppgift: "Skriv ut vilka kategorier som finns, en gång vardera."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "dryck\nbakverk"}
ledtradar:
  - Kolumnen kategori har samma värde på flera rader.
  - SELECT DISTINCT tar bort dubbletter.
  - visa("SELECT DISTINCT kategori FROM varor")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT DISTINCT kategori FROM varor")
```

## Det här lärde du dig

- `SELECT kolumner FROM tabell` hämtar kolumner, och `*` betyder alla.
- `SELECT DISTINCT` tar bort dubbletter.
- Du kör SQL från Python med `db.execute(...)`, och här gör `visa(...)` det åt dig.
