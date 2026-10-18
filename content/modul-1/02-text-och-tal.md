---
titel: Text och tal
mal: Efter den här lektionen vet du skillnaden mellan text och tal i Python, och att citattecken avgör vilket det är.
---

## Prova först

Kör koden och jämför raderna.

```python-exempel
print(7)
print("7")
print(2 + 3)
print("2 + 3")
```

Första och andra raden ser likadana ut, men tredje och fjärde är olika. Varför?

## Text eller tal?

- Utan citattecken är det ett **tal**, och Python kan räkna med det. `2 + 3` blir `5`.
- Med citattecken är det **text**, och Python skriver bara ut det som det står. `"2 + 3"` blir `2 + 3`.

Texten `"7"` och talet `7` ser likadana ut på skärmen, men Python behandlar dem olika. Det märks när man försöker räkna med dem.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel är skillnaden mellan tal och text synlig: ett tal kan summeras med `SUMMA`, medan ett tal som står som text (ofta vänsterjusterat med en liten grön triangel) inte räknas med. I Python är det citattecknen som avgör.
```

```forutsag
kod: |
  print("2" + "3")
alternativ: ["5", "23", "Ett felmeddelande", "2 + 3"]
ratt: 1
forklaring: "Plustecknet mellan två texter sätter ihop dem: \"2\" och \"3\" blir \"23\". Det räknas inte ihop som tal."
```

```forutsag
kod: |
  print("Hej " + "Kalle")
svar: "Hej Kalle"
forklaring: "Plus mellan texter sätter ihop dem. Notera mellanslaget efter Hej i den första texten: det hamnar i resultatet."
```

## Din tur

```ovning
id: m1-text-satta-ihop
uppgift: "Skriv ut `Hej Anna` genom att sätta ihop två texter med `+`: `\"Hej \"` och `\"Anna\"`."
start: |
  # skriv din kod här
ratta: {utdata: "Hej Anna"}
ledtradar:
  - Du behöver två texter med ett plustecken mellan, inom en print.
  - Den första texten ska sluta med ett mellanslag, så att det blir Hej Anna och inte HejAnna.
  - print("Hej " + "Anna")
facit: |
  print("Hej " + "Anna")
```

```ovning
id: m1-tal-rakna
uppgift: "Skriv ut resultatet av `10 + 5` som ett tal, alltså utan citattecken runt uträkningen."
start: |
  # skriv din kod här
ratta: {utdata: "15"}
ledtradar:
  - Uträkningen ska stå utan citattecken, så att Python räknar.
  - Skriv uträkningen inom parenteserna på print.
  - print(10 + 5)
facit: |
  print(10 + 5)
```

## Det här lärde du dig

- Utan citattecken är det ett tal som Python räknar med.
- Med citattecken är det text som Python skriver ut som det står.
- `+` mellan texter sätter ihop dem.
