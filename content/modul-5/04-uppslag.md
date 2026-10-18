---
titel: Uppslag (dict)
mal: Efter den här lektionen kan du spara värden under namn i ett uppslag och slå upp dem.
---

## Prova först

Kör koden. Ändra åldern och kör igen.

```python-exempel
person = {"namn": "Anna", "alder": 30}
print(person["namn"])
print(person["alder"])
person["stad"] = "Lund"
print(person)
```

## Vad är ett uppslag?

Ett **uppslag** (på engelska *dict*, från dictionary) sparar värden under **nycklar** i stället för under platsnummer. Det skrivs med klammerparenteser: `{"nyckel": värde, "nyckel2": värde2}`.

- Du slår upp ett värde med nyckeln: `person["namn"]`.
- Du lägger till eller ändrar med `person["stad"] = "Lund"`.
- `"namn" in person` kollar om nyckeln finns.
- Slår du upp en nyckel som inte finns får du ett `KeyError`.

```ruta
rubrik: Det här kan du från förut
text: |
  Ett uppslag är som **en rad** i en tabell, där kolumnrubrikerna är nycklarna: namn, ålder, stad. Eller som `=LETARAD()` i Excel: du letar upp ett värde utifrån en nyckel.
```

## Förutsäg

```forutsag
kod: |
  pris = {"kaffe": 30, "te": 25}
  print(pris["te"])
svar: "25"
forklaring: "Uppslaget har nycklarna kaffe och te. Slår du upp te får du 25."
```

## Din tur

```ovning
id: m5-uppslag-skapa
uppgift: "Skapa ett uppslag `bil` med nycklarna `marke` (värdet `Volvo`) och `ar` (värdet `2020`), och skriv ut märket."
start: |
  # skriv din kod här
ratta: {utdata: "Volvo"}
ledtradar:
  - Klammerparenteser, med nyckel och värde skilda av kolon och posterna av komma.
  - "Nycklarna är texter, och värdet 2020 är ett tal."
  - "bil = {\"marke\": \"Volvo\", \"ar\": 2020} och print(bil[\"marke\"])."
facit: |
  bil = {"marke": "Volvo", "ar": 2020}
  print(bil["marke"])
```

```ovning
id: m5-uppslag-andra
uppgift: "Uppslaget `lager` finns redan. Öka antalet `bananer` med 5 och skriv ut det nya antalet."
start: |
  lager = {"apelsiner": 10, "bananer": 3}
ratta: {utdata: "8"}
ledtradar:
  - Slå upp värdet med nyckeln, lägg till 5, och lägg tillbaka det under samma nyckel.
  - Det ser ut som en variabeländring, men med lager["bananer"] i stället för ett variabelnamn.
  - "lager[\"bananer\"] = lager[\"bananer\"] + 5 och print(lager[\"bananer\"])."
facit: |
  lager = {"apelsiner": 10, "bananer": 3}
  lager["bananer"] = lager["bananer"] + 5
  print(lager["bananer"])
```

## Det här lärde du dig

- Ett uppslag sparar värden under nycklar: `{"namn": "Anna"}`.
- `uppslag["nyckel"]` slår upp, och `uppslag["ny"] = x` lägger till eller ändrar.
- Nycklarna är oftast texter.
