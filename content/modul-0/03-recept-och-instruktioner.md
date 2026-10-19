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

- Säga **vad** som ska göras ("lägg ihop"),
- Säga **med vad** ("20 och 5"),
- Och i **vilken ordning** det ska göras. Rätt ordning är den ordning som ger rätt resultat. Det finns ingen färdig "rätt" ordning: den beror på vad du vill uppnå.

Datorn fyller aldrig i luckor åt dig. Det låter jobbigt, men det är också skönt: gör du som du skriver blir resultatet alltid detsamma.

## Dela upp stora problem

Programmerare gör nästan alltid samma sak med ett stort problem: de delar upp det i små steg som var och en är exakta. Varje steg gör en sak. Och ibland behöver ett steg resultatet av ett steg före det, så ordningen måste följa det.

Ta ett problem med flera delar: *Du köper tre varor à 20 kr. Du får 10 procent rabatt på varorna, men inte på frakten. Frakten är 10 kr. Visa vad du ska betala.*

Vilket recept ger rätt resultat?

```forutsag
kod: |
  A.  1. Räkna ut priset för varorna (3 gånger 20).
      2. Räkna av rabatten på varorna.
      3. Lägg på frakten.
      4. Visa vad du ska betala.

  B.  1. Räkna ut priset för varorna (3 gånger 20).
      2. Lägg på frakten.
      3. Räkna av rabatten.
      4. Visa vad du ska betala.

  C.  1. Räkna av rabatten.
      2. Räkna ut priset för varorna (3 gånger 20).
      3. Lägg på frakten.
      4. Visa vad du ska betala.

  D.  1. Räkna ut vad du ska betala.
kor: false
alternativ: ["A", "B", "C", "D"]
ratt: 0
forklaring: "A är rätt: varornas pris måste vara uträknat innan rabatten kan räknas av (60 kr, rabatt 6 kr, 54 kr), och frakten läggs på efter, eftersom rabatten bara gäller varorna (54 + 10 = 64 kr). I B räknas rabatten av efter frakten, så den gäller även frakten (70 kr minus 7 kr = 63 kr). I C finns inget pris att räkna rabatt på än, eftersom priset räknas ut först i nästa steg. D är ett enda steg som inte säger hur: det är samma sak som problemet. Ingen ordning är rätt i sig: den rätta är den som ger rätt resultat för just det här problemet."
```

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel kan en uträkning delas upp i små delar: en cell för summan av varorna och en annan som lägger på frakten och hänvisar till den första med en cellreferens som A1. Ett program gör samma sak, fast med namn i stället för cellreferenser. Det får du se i modul 2.
```

## Det här lärde du dig

- En instruktion måste vara exakt, utan gissning eller tolkning.
- Datorn gör bara det som står, i den ordning det står. Rätt ordning är den som ger rätt resultat, och ett steg kan inte använda något som inte är uträknat än.
- Stora problem delas upp i små, exakta steg: en sak per steg, i rätt ordning, och resultatet visas sist.
