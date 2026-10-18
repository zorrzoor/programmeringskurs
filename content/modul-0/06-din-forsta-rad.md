---
titel: Ditt första program
mal: Efter den här lektionen har du skrivit och kört ett eget program med flera rader.
---

## Prova först

Kör programmet. Titta på i vilken ordning raderna skrivs ut.

```python-exempel
print("Först kommer den här raden.")
print("Sedan den här.")
print("Sist den här.")
```

Datorn läser uppifrån och ned och gör en rad i taget. Det är precis som i receptet.

Ändra ordningen på raderna och kör igen. Skrivs raderna ut i den nya ordningen?

```forutsag
kod: |
  print("A")
  print("B")
alternativ: ["A och B på samma rad: AB", "A på en rad och B på nästa", "Bara B", "Ett felmeddelande"]
ratt: 1
forklaring: "Varje print skriver ut sin text och byter rad. Därför hamnar A och B på varsin rad, i den ordning raderna står."
```

## Raden som börjar med #

I kodrutorna står det `# skriv din kod här`. Rader som börjar med `#` är **kommentarer**: Python hoppar över dem. De är anteckningar till den som läser koden, och du kan lämna dem kvar eller radera dem. Skriv ditt program under raden. Mer om kommentarer kommer i modul 1.

## Din tur

```ovning
id: m0-forsta-program-tva
uppgift: "Skriv ett program med två rader. Den första ska skriva ut `Hej!` och den andra `Jag lär mig Python.`"
start: |
  # skriv din kod här
ratta: {utdata: "Hej!\nJag lär mig Python."}
ledtradar:
  - Du behöver två rader med print, en för varje rad som ska skrivas ut.
  - Varje rad ser ut så här, med en text mellan citattecknen, inom parenteserna.
  - print("Hej!") på första raden och print("Jag lär mig Python.") på andra.
facit: |
  print("Hej!")
  print("Jag lär mig Python.")
```

```ovning
id: m0-forsta-program-tre
uppgift: "Skriv ett program med tre rader som skriver ut `Ett`, `Två` och `Tre`, i den ordningen."
start: |
  # skriv din kod här
ratta: {utdata: "Ett\nTvå\nTre"}
ledtradar:
  - Tre rader, tre print.
  - Texterna ska stå inom citattecken, en text per print.
  - print("Ett"), sedan print("Två"), sedan print("Tre").
facit: |
  print("Ett")
  print("Två")
  print("Tre")
```

## Det här lärde du dig

- Ett program är rader som körs uppifrån och ned.
- Varje `print` skriver ut en rad.
- Du har skrivit dina första program. Det var modul 0, och nu börjar det på riktigt.
