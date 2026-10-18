---
titel: Kommentarer
mal: Efter den här lektionen kan du skriva anteckningar i koden med # som datorn hoppar över.
---

## Prova först

Kör koden. Vilka rader syns i resultatet?

```python-exempel
# Det här är en kommentar. Datorn läser den inte.
print("Den här raden körs.")
# print("Den här raden körs inte.")
```

Raderna som börjar med `#` är **kommentarer**. Python hoppar över dem.

## Till vad då?

- **Anteckningar till människor:** att förklara varför koden gör som den gör, för dig själv i morgon eller för någon annan.
- **Stänga av en rad tillfälligt:** sätt `#` först på en rad så körs den inte, utan att du behöver radera den.

```ruta
rubrik: Det här kan du från förut
text: |
  I Excel kan du lägga en anteckning på en cell med högerklick. Kommentarer i kod är samma sak: de påverkar inte
  uträkningen, de finns bara till för den som läser.
```

## Förutsäg

```forutsag
kod: |
  print("A")
  # print("B")
  print("C")
alternativ: ["A, B och C", "A och C", "Bara A", "Ett felmeddelande"]
ratt: 1
forklaring: "Raden med B är en kommentar, så den körs inte. A och C skrivs ut, på varsin rad."
```

## Din tur

```ovning
id: m1-kommentar-stang-av
uppgift: "Programmet skriver ut två rader. Sätt ett `#` först på den andra raden så att bara `Hej` skrivs ut."
start: |
  print("Hej")
  print("Hej då")
ratta: {utdata: "Hej"}
ledtradar:
  - "En rad som börjar med # körs inte."
  - "Sätt # allra först på raden med Hej då."
  - "Raden ska se ut så här: # print(\"Hej då\")"
facit: |
  print("Hej")
  # print("Hej då")
```

```ovning
id: m1-kommentar-skriv-egen
uppgift: "Skriv en kommentar på första raden (börja med `#`) och sedan ett program som skriver ut `Klart!`."
start: |
  # skriv din kod här
ratta: {utdata: "Klart!"}
ledtradar:
  - "Kommentaren är en rad för sig som börjar med #."
  - Under kommentaren skriver du programmet.
  - "Första raden: # Så här skriver jag ut Klart! Andra raden: print(\"Klart!\")"
facit: |
  # Så här skriver jag ut Klart!
  print("Klart!")
```

## Det här lärde du dig

- En rad som börjar med `#` är en kommentar som Python hoppar över.
- Kommentarer förklarar koden för människor.
- Du kan stänga av en rad tillfälligt genom att sätta `#` framför den.
