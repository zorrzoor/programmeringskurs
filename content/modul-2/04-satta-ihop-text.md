---
titel: Sätta ihop text med f-strängar
mal: Efter den här lektionen kan du blanda text och variabler i en utskrift med f-strängar.
---

## Prova först

Kör koden. Ändra namn och ålder, och kör igen.

```python-exempel
namn = "Anna"
alder = 30
print(f"{namn} är {alder} år.")
```

## Så fungerar det

En **f-sträng** är en text med ett `f` framför första citattecknet. Inuti texten sätter du variabelnamn inom `{ }`, och Python byter ut dem mot värdena.

- `f"{namn} är {alder} år."` blir `Anna är 30 år.`
- Du kan till och med räkna inom klamrarna: `f"Totalt: {antal * pris} kr"`.
- Glömmer du f:et skrivs klamrarna ut som de står. Prova.

Det går också att sätta ihop med `+`, men då måste talen göras om till text först. F-strängar är enklare.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  I Excel sätts text och celler ihop med `&`: `=A1&" är "&B1&" år."`. En f-sträng gör samma sak, men variabelnamnen skrivs mitt i texten.
```

## Förutsäg

```forutsag
kod: |
  pris = 20
  print(f"Priset är {pris} kr")
svar: "Priset är 20 kr"
forklaring: "{pris} byts ut mot värdet 20."
```

```forutsag
kod: |
  namn = "Eva"
  print("Hej {namn}")
svar: "Hej {namn}"
forklaring: "Utan f framför citattecknet byts inget ut. Texten skrivs ut precis som den står, med klamrarna."
```

## Din tur

```ovning
id: m2-fstrang-namn-alder
uppgift: "Variablerna `namn` och `alder` finns redan. Skriv ut `Kalle är 35 år.` med en f-sträng."
start: |
  namn = "Kalle"
  alder = 35
ratta: {utdata: "Kalle är 35 år."}
ledtradar:
  - Du behöver en print med en f-sträng, alltså ett f framför citattecknet.
  - Variablerna sätts inom { } mitt i texten.
  - print(f"{namn} är {alder} år.")
facit: |
  namn = "Kalle"
  alder = 35
  print(f"{namn} är {alder} år.")
```

```ovning
id: m2-fstrang-total
uppgift: "Variablerna `antal` och `pris` finns redan. Skriv ut `Totalt: 60 kr` med en f-sträng där du räknar ut summan inom klamrarna."
start: |
  antal = 3
  pris = 20
ratta: {utdata: "Totalt: 60 kr"}
ledtradar:
  - Du kan räkna inom { } i en f-sträng.
  - Uträkningen är antal * pris.
  - "print(f\"Totalt: {antal * pris} kr\")"
facit: |
  antal = 3
  pris = 20
  print(f"Totalt: {antal * pris} kr")
```

## Det här lärde du dig

- En f-sträng har ett `f` framför citattecknet.
- Inom `{ }` sätter du variabler eller uträkningar.
- Utan `f` skrivs klamrarna ut som text.
