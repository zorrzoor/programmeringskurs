---
titel: Recept och instruktioner
mal: Efter den här lektionen vet du att en instruktion till en dator måste vara så exakt att den inte går att missförstå.
---

## Vilken instruktion kan en dator följa?

En kollega kan svara på "gör det som brukar vara bäst". En dator kan inte det. Vilken av de här instruktionerna kan en dator följa?

```forutsag
kod: |
  A. Räkna ut ungefär vad det kostar.
  B. Lägg ihop 20 och 5.
  C. Gör det som brukar vara bäst.
  D. Se till att det blir bra.
kor: false
alternativ: ["A", "B", "C", "D"]
ratt: 1
forklaring: "Bara B är exakt: det finns inget att tolka eller gissa. \"Ungefär\", \"bäst\" och \"bra\" betyder olika saker för olika människor, så en dator kan inte följa dem."
```

## Exakt betyder exakt

När du säger åt en dator vad den ska göra måste du:

- säga **vad** som ska göras ("lägg ihop 20 och 5"),
- säga **med vad** ("20 och 5"),
- och göra det i **rätt ordning**.

Datorn fyller aldrig i luckor åt dig. Det låter jobbigt, men det är också skönt: gör du som du skriver blir resultatet alltid detsamma.

## Dela upp stora problem

Programmerare gör nästan alltid samma sak med ett stort problem: de delar upp det i små steg som var och en är exakt. Om du ska räkna ut vad tre varor à 20 kr kostar med 10 kr i frakt kan du tänka så här:

1. Räkna ut priset för varorna: 3 gånger 20.
2. Lägg på frakten.

```forutsag
kod: |
  Tre varor kostar 20 kr styck. Frakten är 10 kr.
  Vad blir totalpriset?
kor: false
alternativ: ["70 kr", "230 kr", "90 kr", "260 kr"]
ratt: 0
forklaring: "Först 3 × 20 = 60, sedan 60 + 10 = 70. Två små, exakta steg i rätt ordning."
```

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan en uträkning delas upp i små: en cell för summan av varorna och en annan som lägger på frakten och refererar till den första med cellnummer. Ett program gör samma sak, fast med namn i stället för cellnummer. Det får du se i modul 2.
```

## Det här lärde du dig

- En instruktion måste vara exakt, utan gissning eller tolkning.
- Datorn gör bara det som står, i den ordning det står.
- Stora problem delas upp i små, exakta steg.
