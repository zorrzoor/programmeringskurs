---
titel: Ge kod ett namn
mal: Efter den här lektionen kan du skapa en egen funktion och köra den när du vill.
---

## Prova först

Kör koden. Notera att ingenting skrivs ut förrän funktionen anropas på de sista raderna.

```python-exempel
def halsa():
    print("Hej!")
    print("Välkommen.")

halsa()
halsa()
```

## Vad är en funktion?

En **funktion** (på engelska *function*) är en bit kod som du har gett ett **namn**. Du skriver den en gång med `def`, och kör den sedan så många gånger du vill genom att skriva namnet med parenteser: `halsa()`. Det kallas att **anropa** funktionen.

- `def halsa():` är **definitionen**. Den slutar med kolon, och raderna som hör till är indragna.
- Definitionen **gör ingenting** i sig. Den berättar bara för Python vilka rader som hör till namnet. Koden körs först när du anropar funktionen.
- Funktionen du har använt hela tiden, `print(...)`, är också en funktion, som någon annan har skrivit åt dig.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Ett **makro** i Excel som har fått ett namn är samma idé: stegen spelas in en gång och körs sedan med namnet. Ett **namngivet område** fungerar också så: namnet skrivs i stället för att innehållet upprepas.
```

```forutsag
kod: |
  def hej():
      print("A")

  print("B")
  hej()
  hej()
alternativ: ["A, B", "B, A, A", "A, A, B", "B"]
ratt: 1
forklaring: "Definitionen skriver ingenting ut. Först körs print(B), sedan anropas hej() två gånger, och varje anrop skriver ut A."
```

## Din tur

```ovning
id: m6-funktion-skapa
uppgift: "Skapa en funktion `tack` som skriver ut `Tack!`, och anropa den två gånger."
start: |
  # skriv din kod här
ratta: {utdata: "Tack!\nTack!"}
ledtradar:
  - Du behöver en definition med def, och två anrop efteråt.
  - Definitionen slutar med kolon, och print har indrag. Anropen har inget indrag.
  - "def tack(): med print(\"Tack!\") indragen under, och sedan tack() två gånger på egna rader."
facit: |
  def tack():
      print("Tack!")

  tack()
  tack()
```

## Det här lärde du dig

- `def namn():` skapar en funktion, och `namn()` anropar den.
- Raderna som hör till funktionen har indrag.
- Funktionen körs först när den anropas, inte när den definieras.
