---
titel: Skriva ut med print
mal: Efter den här lektionen kan du skriva ut text och flera rader med print.
---

## Prova först

Kör koden. Ändra sedan texterna och kör igen.

```python-exempel
print("Hej!")
print("Vad roligt att du är här.")
```

Du kan också skriva ut en tom rad. Prova att lägga till `print()` mellan de två raderna ovan.

## Så fungerar print

`print` är ett **kommando**: ett ord som får datorn att göra något. Det du vill skriva ut skriver du inom parenteserna.

- En text (programmerare säger **sträng**) står mellan citattecken: `"Hej!"`. Du kan använda dubbla `"` eller enkla `'`, bara du använder samma sort i början och slutet.
- `print()` med tomma parenteser skriver ut en tom rad.
- Varje `print` börjar på en ny rad.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel visar `="Hej"` texten Hej i en cell. `print` visar på samma sätt en text, men på skärmen i stället för i en cell.
```

```forutsag
kod: |
  print("Kaffe")
  print()
  print("Te")
alternativ: ["Kaffe, Te (tre rader, ingen tom)", "Kaffe, en tom rad, Te", "KaffeTe på en rad", "Ett felmeddelande"]
ratt: 1
forklaring: "print() skriver ut en tom rad. Därför blir det Kaffe, en tom rad och sedan Te."
```

## Din tur

```ovning
id: m1-print-tre-rader
uppgift: "Skriv ut tre rader: `Äpple`, `Banan` och `Citron`."
start: |
  # skriv din kod här
ratta: {utdata: "Äpple\nBanan\nCitron"}
ledtradar:
  - En print för varje rad.
  - print("Äpple") skriver ut första raden. Gör likadant för de andra.
  - print("Äpple"), print("Banan") och print("Citron"), var och en på en egen rad.
facit: |
  print("Äpple")
  print("Banan")
  print("Citron")
```

```ovning
id: m1-print-tom-rad
uppgift: "Skriv ut `Rad 1`, sedan en tom rad, och sedan `Rad 3`."
start: |
  # skriv din kod här
ratta: {utdata: "Rad 1\n\nRad 3"}
ledtradar:
  - Det ska bli tre rader totalt, men den mittersta ska vara tom.
  - print() med tomma parenteser skriver ut en tom rad.
  - print("Rad 1"), print() och print("Rad 3").
facit: |
  print("Rad 1")
  print()
  print("Rad 3")
```

## Det här lärde du dig

- `print("text")` skriver ut en text, och `print()` en tom rad.
- Text står inom citattecken.
- Varje print ger en ny rad.
