---
titel: Ändra en variabel
mal: Efter den här lektionen kan du ändra värdet på en variabel.
---

## Prova först

Kör koden. Ändra 5 till 10 och kör igen.

```python-exempel
pris = 20
pris = pris + 5
print(pris)
```

Resultatet är `25`, inte `20`. Hur kunde priset ändras?

## Se vad som händer

Tryck på **Stegvis** under exemplet och gå fram med **Nästa**. Titta i tabellen: efter rad 1 är `pris` 20, och efter rad 2 är det 25. Det gamla värdet försvinner när det nya läggs dit, och det är precis det som den här lektionen handlar om.

## Raden som ser ut som en ekvation

Raden `pris = pris + 5` ser ut som en ekvation som aldrig kan stämma, men den är inget påstående. Den är ett **kommando**:

1. Ta det som finns i `pris` (20).
2. Lägg på 5 (blir 25).
3. Lägg tillbaka resultatet i `pris`.

Därför står det 25 på slutet, inte 20. Det gamla värdet 20 försvann när det nya lades dit.

Det finns ett kortare sätt att skriva samma sak: `pris += 5`. Det betyder "lägg på 5 till pris". Det går lika bra med `-=`, `*=` och `/=`.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan en cell som heter *pris* användas i `=pris+5` i en annan cell. I Python skrivs det som ett **kommando** och resultatet *läggs tillbaka* i pris. Det är därför det bara står 25 på slutet, och inte både 20 och 25.
```

```forutsag
kod: |
  a = 3
  a = a * 2
  print(a)
alternativ: ["3", "6", "9", "Ett felmeddelande"]
ratt: 1
forklaring: "Först sparas 3 i a. Sedan tas 3, ganger 2 blir 6, och 6 läggs tillbaka i a. Därför skrivs 6 ut."
```

```forutsag
kod: |
  poang = 10
  poang += 5
  poang += 5
  print(poang)
svar: "20"
forklaring: "10, plus 5 blir 15, plus 5 blir 20."
```

## Din tur

```ovning
id: m2-andra-lon
uppgift: "Sätt `lön = 25000`, höj den med 1000 och skriv ut den nya lönen."
start: |
  # skriv din kod här
ratta: {utdata: "26000"}
ledtradar:
  - Börja med att skapa variabeln lön.
  - Ändra lön med "lön = lön + ...".
  - Sist ska du skriva ut lön med print.
facit: |
  lön = 25000
  lön = lön + 1000
  print(lön)
```

```ovning
id: m2-andra-dubbla
uppgift: "Sätt `pris = 15`, dubbla det med `*` och skriv ut det nya priset."
start: |
  # skriv din kod här
ratta: {utdata: "30"}
ledtradar:
  - Skapa först variabeln pris med värdet 15.
  - Ändra pris så att det blir pris gånger 2.
  - pris = 15, pris = pris * 2 och print(pris).
facit: |
  pris = 15
  pris = pris * 2
  print(pris)
```

## Det här lärde du dig

- `pris = pris + 5` är ett kommando: ta värdet, räkna, lägg tillbaka.
- Det gamla värdet ersätts av det nya.
- `pris += 5` är en kortare variant.
