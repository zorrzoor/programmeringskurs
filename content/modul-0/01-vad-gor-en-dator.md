---
titel: Vad gör en dator?
mal: Efter den här lektionen vet du vad en dator faktiskt gör, och varför instruktioner till den måste vara exakta.
---

## Börja med att gissa

Du ger en kollega en lapp med fyra rader:

1. Börja med talet 4.
2. Multiplicera med 3.
3. Dra ifrån 2.
4. Dubbla resultatet.

Kollegan följer lappen rad för rad, utan att fundera över varför. Vilket tal har kollegan efter rad 4?

```forutsag
kod: |
  Rad 1: börja med 4
  Rad 2: multiplicera med 3
  Rad 3: dra ifrån 2
  Rad 4: dubbla resultatet
alternativ: ["10", "12", "20", "22"]
kor: false
ratt: 2
forklaring: "4 * 3 = 12, 12 - 2 = 10 och 10 * 2 = 20. Ordningen avgör: om dubblingen hade kommit före avdraget hade svaret blivit ett annat."
```

En dator gör precis det här, fast med miljarder enkla instruktioner i sekunden. Den läser en instruktion, utför den och går vidare till nästa. Ett program på 100 rader blir i själva verket många hundra enkla instruktioner till processorn.

## Vad en dator faktiskt gör

Allt en dator gör kan beskrivas med tre delar:

- **Indata**: det som kommer in, till exempel tangenttryckningar, en fil eller en siffra du skriver.
- **Bearbetning**: processorn utför instruktioner på indatan, en i taget. Varje instruktion är ytterst enkel: lägg ihop två tal, jämför två värden, flytta ett värde till en annan plats.
- **Utdata**: det som kommer ut, till exempel text på skärmen, en ljudfil eller ett sparat dokument.

Mellan stegen håller datorn reda på värden i **minnet**. Det som ser avancerat ut, som att visa en bild eller söka bland miljoner poster, är ett mycket stort antal enkla steg i rätt ordning.

## Exakt, inte klok

En dator är **snabb** men inte **klok**. Den läser instruktionerna och gör precis det som står, utan att fundera över vad du kanske menade. Det har två följder som du kommer att märka direkt:

- Samma instruktioner och samma indata ger **alltid** samma resultat.
- Det som inte står i instruktionerna görs inte. Datorn fyller aldrig i luckor åt dig.

```ruta
rubrik: Tänk på ett recept
text: |
  Ett recept säger "vispa", inte "gör något gott". Ett program är samma sak: en lista med exakta steg som datorn följer i tur och ordning. Ett makro i Excel är ett exempel på ett sådant program.
```

Prova själv: vad händer med den här instruktionen?

```forutsag
kod: |
  Du ber datorn:
  "Visa de största kunderna först."
alternativ: ["Datorn gissar vad störst betyder och visar kunderna", "Ingenting händer, datorn förstår inte vad som menas med störst", "Datorn visar kunderna i bokstavsordning", "Datorn frågar vilken kund du menar"]
kor: false
ratt: 1
forklaring: "Datorn kan inte gissa vad störst betyder: störst omsättning, flest köp eller något annat? Allt den ska veta måste stå i instruktionerna, och att formulera dem exakt är kärnan i programmering."
```

## Vad kommer härnäst?

I nästa lektion tittar vi på vad ett **program** är. Redan om några lektioner skriver du ditt eget och ser datorn göra det du bad om.
