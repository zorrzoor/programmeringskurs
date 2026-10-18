---
titel: Vad gör en dator?
mal: Efter den här lektionen vet du att en dator gör exakt det den blir tillsagd, en sak i taget.
---

## Börja med att gissa

Du ger en kollega en lapp med två rader:

1. Ta fram siffran 7.
2. Lägg till 5.

Kollegan följer lappen rad för rad. Vad har kollegan i handen efter rad 2?

```forutsag
kod: |
  Rad 1: ta fram 7
  Rad 2: lägg till 5
alternativ: ["5", "7", "12", "75"]
kor: false
ratt: 2
forklaring: "Först 7, sedan 7 + 5 = 12. Rad för rad, i den ordning de står."
```

Det var ingen svår fråga, och det är poängen. En dator gör precis samma sak som kollegan: den läser en rad,
gör den, och går vidare till nästa.

## Datorn tänker inte själv

En dator är **snabb** men inte **klok**. Den gör exakt det som står, och ingenting annat. Om du glömmer att säga
något, gissar den inte: den gör bara inte det.

```ruta
rubrik: Det här kan du från förut
text: |
  Tänk på ett makro i Excel, eller på ett recept. Ett makro gör steg för steg det någon har skrivit, och ett recept
  säger "vispa", inte "gör något gott". Ett program är samma sak: en lista med steg som datorn följer i tur och ordning.
```

## Vad kommer härnäst?

I nästa lektion tittar vi på vad ett **program** är. Redan om några lektioner skriver du ditt eget och ser datorn
göra det du bad om.

```forutsag
kod: |
  Du ber datorn: "Skriv ut mitt namn."
  Du har inte sagt vad ditt namn är.
alternativ: ["Datorn kan ta reda på det", "Datorn skriver ut något ändå", "Datorn kan inte göra det, för den vet inte vad du heter"]
kor: false
ratt: 2
forklaring: "Datorn gissar aldrig. Allt den ska veta måste stå i instruktionerna."
```
