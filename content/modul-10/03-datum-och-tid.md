---
titel: "Datum och tid"
mal: "Efter den här lektionen kan du räkna med datum: skillnad i dagar, lägga till tid, veckodag och att göra om text till datum."
---

## Prova först

Kör koden. Den räknar ut skillnaden mellan två datum, och ett datum 30 dagar fram.

```python-exempel
from datetime import date, timedelta

start = date(2026, 10, 18)
slut = date.fromisoformat("2026-12-24")
print(start)
print(slut - start)
print((slut - start).days)
print(start + timedelta(days=30))
print(start.strftime("%d/%m/%Y"))
```

## Datum som värden

Modulen `datetime` räknar med datum på riktigt, så att du slipper tänka på hur många dagar varje månad har.

- `date(2026, 10, 18)` är ett datum (år, månad, dag), och `date.fromisoformat("2026-12-24")` gör det av en text på formen år-månad-dag.
- Två datum kan dras ifrån varandra: resultatet är en **tidsskillnad**, och `.days` är antalet dagar.
- `timedelta(days=30)` är en tidsskillnad på 30 dagar som du kan lägga till ett datum.
- `datum.year`, `datum.month` och `datum.day` ger delarna, och `datum.weekday()` ger veckodag som ett tal, där måndag är 0 och söndag 6.
- `datum.strftime("%d/%m/%Y")` skriver ut ett datum som du vill: `%d` är dag, `%m` månad och `%Y` år. Med `from datetime import datetime` gör `datetime.strptime("24/12/2026", "%d/%m/%Y")` tvärtom: text till ett datum med klockslag. `.date()` tar bort klockslaget.

För dagens datum finns `date.today()`. Övningarna här använder fasta datum, så att rättningen alltid får samma svar.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det motsvarar Excels datumfunktioner: DATUM, DAGAR, VECKODAG och TEXT(datum; "åååå-mm-dd"). Funktionernas exakta namn kan variera med Excels version och språkinställning. Excel lagrar datum som tal, men Python har en egen sorts värde för datum. Veckodagen räknas också olika: i Excel är söndag dag 1, i Python är måndag 0.
```

## Fråga

```forutsag
kod: |
  from datetime import date

  print(date(2026, 3, 1) - date(2026, 2, 1))
kor: true
alternativ: ["28 days, 0:00:00", "1 days, 0:00:00", "29", "31 days, 0:00:00"]
ratt: 0
forklaring: "Februari 2026 har 28 dagar (2026 är inte ett skottår), så skillnaden mellan 1 februari och 1 mars är 28 dagar. Python skriver en tidsskillnad som dagar och klockslag."
```

## Din tur

```ovning
id: m10-datum-dagar
uppgift: "Skriv ut hur många dagar det är mellan 2026-10-18 och 2026-12-24."
start: |
  from datetime import date
ratta: {"utdata": "67"}
ledtradar:
  - "Dra det ena datumet ifrån det andra, och ta .days."
  - "Det senare datumet minus det tidigare ger ett positivt antal dagar."
  - "print((date(2026, 12, 24) - date(2026, 10, 18)).days)"
facit: |
  from datetime import date

  print((date(2026, 12, 24) - date(2026, 10, 18)).days)
```

```ovning
id: m10-datum-framat
uppgift: "Skriv ut datumet 100 dagar efter 2026-01-01, på formen 2026-04-11."
start: |
  from datetime import date, timedelta
ratta: {"utdata": "2026-04-11"}
ledtradar:
  - "Lägg en tidsskillnad på 100 dagar till datumet."
  - "timedelta(days=100) är tidsskillnaden."
  - "print(date(2026, 1, 1) + timedelta(days=100))"
facit: |
  from datetime import date, timedelta

  print(date(2026, 1, 1) + timedelta(days=100))
```

```ovning
id: m10-datum-veckodag
uppgift: "Skriv en funktion `veckodag(datum)` som tar ett datum som text på formen `2026-10-18` och returnerar veckodagens namn på svenska med liten bokstav: `måndag`, `tisdag` och så vidare."
start: |
  from datetime import date

  # skriv din funktion här
ratta: {"funktion": "veckodag", "tester": [{"in": ["2026-10-18"], "ut": "söndag"}, {"in": ["2026-10-19"], "ut": "måndag"}, {"in": ["2026-01-01"], "ut": "torsdag"}]}
ledtradar:
  - "Gör texten till ett datum, och ta reda på veckodagens nummer."
  - "weekday() ger 0 för måndag. Använd numret som index i en lista med namnen."
  - "namn[date.fromisoformat(datum).weekday()]"
facit: |
  from datetime import date

  def veckodag(datum):
      namn = ["måndag", "tisdag", "onsdag", "torsdag", "fredag", "lördag", "söndag"]
      return namn[date.fromisoformat(datum).weekday()]
```

```ovning
id: m10-datum-omvandla
uppgift: "Skriv en funktion `omvandla(text)` som gör om ett datum på formen `24/12/2026` till formen `2026-12-24`."
start: |
  from datetime import datetime

  # skriv din funktion här
ratta: {"funktion": "omvandla", "tester": [{"in": ["24/12/2026"], "ut": "2026-12-24"}, {"in": ["01/03/2025"], "ut": "2025-03-01"}]}
ledtradar:
  - "Läs texten som ett datum med strptime, och skriv ut det i den andra formen."
  - "datetime.strptime(text, \"%d/%m/%Y\") läser texten, och .strftime(\"%Y-%m-%d\") skriver ut den som år-månad-dag."
  - "return datetime.strptime(text, \"%d/%m/%Y\").strftime(\"%Y-%m-%d\")"
facit: |
  from datetime import datetime

  def omvandla(text):
      return datetime.strptime(text, "%d/%m/%Y").strftime("%Y-%m-%d")
```

## Det här lärde du dig

- `date(år, månad, dag)` är ett datum, och två datum kan dras ifrån varandra: `.days` är antalet dagar.
- `timedelta(days=n)` läggs till eller dras ifrån ett datum.
- `strftime` skriver ut ett datum som text, och `strptime` läser text till ett datum.
