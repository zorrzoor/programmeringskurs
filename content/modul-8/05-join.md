---
titel: Koppla ihop tabeller med JOIN
mal: Efter den här lektionen kan du koppla ihop två tabeller med JOIN.
---

Samma butik, men nu används även tabellen `ordrar`. Varje order har ett `vara_id` som pekar på `id` i `varor`.

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

visa("SELECT varor.namn, ordrar.antal FROM ordrar JOIN varor ON ordrar.vara_id = varor.id")
```

Kör koden. Varje order visas nu med varans namn i stället för bara ett id.

## JOIN

Data delas ofta upp i flera tabeller: varorna på ett ställe och ordrarna på ett annat, så att varje vara bara skrivs in en gång. `JOIN` kopplar ihop dem igen:

- `FROM ordrar JOIN varor` kopplar rader i de två tabellerna.
- `ON ordrar.vara_id = varor.id` anger **vilka** rader som hör ihop: de där id:na matchar.
- Med `tabell.kolumn` anger du vilken tabell en kolumn kommer från.

Efter en `JOIN` kan du använda `WHERE`, `GROUP BY` och allt annat som förut.

```ruta
rubrik: Du kanske känner igen det från databasprogram
text: |
  Det är en relation mellan två tabeller i ett databasprogram: linjen du drar mellan nyckelfälten. `JOIN` är samma koppling, uttryckt som text.
```

```forutsag
kod: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT varor.namn, SUM(ordrar.antal) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.namn")
alternativ: ["bulle 4, kaffe 4, kaka 2, te 3, på varsin rad", "kaffe 4, te 3, bulle 4, kaka 2", "bulle 4, kaffe 3, kaka 2, te 2", "juice 0 och fyra till"]
ratt: 0
forklaring: "Ordrarna kopplas till varornas namn och grupperas per namn i bokstavsordning. Kaffe har 3 + 1 = 4, te 2 + 1 = 3, bulle 4 och kaka 2. Juice har ingen order och syns inte alls."
```

## Din tur

```ovning
id: m8-join-omsattning
uppgift: "Skriv ut omsättningen (antal gånger pris) per vara, på formen `bulle 60`, i bokstavsordning efter varans namn."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bulle 60\nkaffe 120\nkaka 40\nte 75"}
ledtradar:
  - Koppla ordrar till varor, och gruppera på varans namn.
  - Omsättningen per vara är SUM(ordrar.antal * varor.pris).
  - visa("SELECT varor.namn, SUM(ordrar.antal * varor.pris) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.namn")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT varor.namn, SUM(ordrar.antal * varor.pris) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.namn")
```

```ovning
id: m8-join-kategori
uppgift: "Skriv ut hur många enheter som beställts per kategori, på formen `bakverk 6`."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bakverk 6\ndryck 7"}
ledtradar:
  - "Kategorin finns i varor, antalet i ordrar: du behöver en JOIN."
  - Gruppera på varor.kategori och summera ordrar.antal.
  - visa("SELECT varor.kategori, SUM(ordrar.antal) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.kategori")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT varor.kategori, SUM(ordrar.antal) FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.kategori")
```

```ovning
id: m8-join-manga
uppgift: "Skriv ut namnen på de varor som beställts i mer än tre enheter sammanlagt."
start: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)
ratta: {utdata: "bulle\nkaffe"}
ledtradar:
  - Summera antalet per vara, och filtrera grupperna.
  - HAVING SUM(ordrar.antal) > 3.
  - visa("SELECT varor.namn FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.namn HAVING SUM(ordrar.antal) > 3")
facit: |
  import sqlite3

  db = sqlite3.connect(":memory:")
  db.executescript(open("butik.sql", encoding="utf-8").read())

  def visa(sql):
      for rad in db.execute(sql):
          print(*rad)

  visa("SELECT varor.namn FROM ordrar JOIN varor ON ordrar.vara_id = varor.id GROUP BY varor.namn HAVING SUM(ordrar.antal) > 3")
```

## Det här lärde du dig

- `JOIN tabell ON a.kolumn = b.kolumn` kopplar ihop rader som hör ihop.
- `tabell.kolumn` anger vilken tabell en kolumn kommer från.
- Efter en JOIN fungerar `WHERE`, `GROUP BY` och `ORDER BY` som vanligt.
