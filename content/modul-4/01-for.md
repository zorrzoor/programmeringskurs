---
titel: Upprepa med for
mal: Efter den här lektionen kan du låta ett program göra samma sak flera gånger med for och range.
---

## Prova först

Kör koden. Ändra `3` till `5` och kör igen.

```python-exempel
for i in range(3):
    print("Hej!")
```

Samma rad körs tre gånger, fast du bara skrev den en gång.

## Så fungerar for

- `for i in range(3):` betyder "gör det här tre gånger".
- Raderna som ska upprepas är **indragna** (fyra mellanslag), precis som under `if`.
- `i` är en variabel som får ett nytt värde för varje varv: först 0, sedan 1, sedan 2. Räkningen börjar på **noll**.

```python-exempel
for i in range(3):
    print(i)
```

```ruta
rubrik: Det här kan du från förut
text: |
  I Excel skriver du en formel i en cell och drar i hörnet för att **fylla nedåt**. En loop är samma idé: du skriver instruktionen en gång och datorn upprepar den. Prova **Stegvis** och se `i` ändras för varje varv.
```

## Förutsäg

```forutsag
kod: |
  for i in range(3):
      print(i)
alternativ: ["1, 2, 3", "0, 1, 2", "0, 1, 2, 3", "3, 3, 3"]
ratt: 1
forklaring: "range(3) ger talen 0, 1 och 2: tre varv, och räkningen börjar på noll."
```

## Din tur

```ovning
id: m4-for-hej
uppgift: "Skriv ut `Hej` fyra gånger med en for-loop."
start: |
  # skriv din kod här
ratta: {utdata: "Hej\nHej\nHej\nHej"}
ledtradar:
  - Du behöver en for-rad med range, och en print under.
  - for-raden slutar med kolon, och print har indrag.
  - "for i in range(4): och under, indragen: print(\"Hej\")"
facit: |
  for i in range(4):
      print("Hej")
```

```ovning
id: m4-for-siffror
uppgift: "Skriv ut talen `0`, `1`, `2`, `3` och `4`, ett per rad, med en for-loop."
start: |
  # skriv din kod här
ratta: {utdata: "0\n1\n2\n3\n4"}
ledtradar:
  - Du vill skriva ut variabeln som räknar, inte en fast text.
  - range(5) ger talen 0 till 4.
  - "for i in range(5): och print(i) med indrag."
facit: |
  for i in range(5):
      print(i)
```

## Det här lärde du dig

- `for i in range(n):` upprepar raderna under `n` gånger.
- `i` räknar varv och börjar på 0.
- Raderna som upprepas har indrag.
