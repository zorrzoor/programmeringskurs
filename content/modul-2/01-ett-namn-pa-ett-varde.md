---
titel: Ett namn på ett värde
mal: Efter den här lektionen kan du skapa en variabel och skriva ut den.
---

## Prova först

Kör koden. Ändra 20 till 35 och kör igen.

```python-exempel
pris = 20
print(pris)
```

Det som skrivs ut är `20`, inte ordet `pris`. Datorn tittade efter vad `pris` står för, och skrev ut det.

## Se vad som händer

Tryck på **Stegvis** under exemplet. Då körs koden en rad i taget. Pilen visar vilken rad som körs härnäst, och tabellen visar vilka variabler som finns och vad de har för värde. Tryck på **Nästa** och titta på när `pris` dyker upp.

## Vad är en variabel?

Raden `pris = 20` **skapar en variabel**. En variabel är ett **namn på ett värde**. Efter raden kan du skriva `pris` där du vill ha värdet 20.

- Namnet står till vänster, värdet till höger.
- `=` betyder här **"spara i"**, inte "är lika med". Läs raden som "lägg 20 i pris".
- Namnet får innehålla bokstäver (även å, ä, ö), siffror och understreck, men inte börja med en siffra och inte ha mellanslag. `pris`, `antal_varor` och `lön` går bra. I övningarna skriver vi ändå namnen utan å, ä och ö (till exempel `alder`), så att rättningen hittar rätt variabel.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan en cell få ett namn, till exempel *pris*, och användas som `=pris*2` i en annan cell. En variabel i Python är samma idé: ett värde med ett namn. Skillnaden är att den skapas med en rad kod.
```

```forutsag
kod: |
  tal = 4
  print(tal)
svar: "4"
forklaring: "Först sparas 4 i tal. print(tal) skriver ut värdet som tal står för, alltså 4."
```

```forutsag
kod: |
  a = 3
  b = a
  print(b)
svar: "3"
forklaring: "b = a betyder \"lägg det som finns i a i b\". Då finns 3 i b, och det skrivs ut."
```

## Din tur

```ovning
id: m2-variabel-alder
uppgift: "Skapa en variabel som heter `alder` och ge den värdet `30`. Skriv också ut den."
start: |
  # skriv din kod här
ratta: {variabler: {alder: 30}}
ledtradar:
  - Namnet står till vänster och värdet till höger om =.
  - Raden ska börja med alder = och sedan värdet.
  - alder = 30 och sedan print(alder).
facit: |
  alder = 30
  print(alder)
```

```ovning
id: m2-variabel-tva
uppgift: "Skapa två variabler: `namn` med texten `Anna` och `stad` med texten `Lund`."
start: |
  # skriv din kod här
ratta: {variabler: {namn: "Anna", stad: "Lund"}}
ledtradar:
  - Två rader, en för varje variabel.
  - Text står inom citattecken. Tal gör det inte.
  - namn = "Anna" och stad = "Lund".
facit: |
  namn = "Anna"
  stad = "Lund"
```

## Det här lärde du dig

- En variabel är ett namn på ett värde: `pris = 20`.
- `=` betyder "spara i".
- Du kan skriva namnet där du vill ha värdet.
