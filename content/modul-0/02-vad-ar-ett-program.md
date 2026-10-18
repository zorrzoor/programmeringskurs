---
titel: Vad är ett program?
mal: Efter den här lektionen vet du att ett program är en lista med instruktioner som datorn följer uppifrån och ned, och att ordningen spelar roll.
---

## Ett recept är ett program

Så här kokar du ett ägg:

1. Fyll en kastrull med vatten och koka upp det.
2. Lägg i ägget.
3. Koka i sju minuter.
4. Ta upp ägget.

Det är ett **program**: en lista med instruktioner som görs en i taget, i en bestämd ordning.

Vad händer om du blandar ordningen? Gissa först.

```forutsag
kod: |
  1. Fyll en kastrull med vatten och koka upp det.
  2. Koka i sju minuter.
  3. Lägg i ägget.
  4. Ta upp ägget.
kor: false
alternativ: ["Ägget blir kokt i sju minuter, precis som förut", "Ägget blir inte kokt: det läggs i efter att kokandet är över", "Ingenting händer, för att stegen är för många"]
ratt: 1
forklaring: "Stegen görs uppifrån och ned, exakt i den ordning de står. Ändrar du ordningen blir resultatet ett annat."
```

## Samma sak i en dator

Ett datorprogram ser inte ut som ett recept, men det fungerar likadant:

- Datorn läser **uppifrån och ned**, en rad i taget.
- Den gör varje rad **exakt** som den står.
- **Ordningen spelar roll.**

```ruta
rubrik: Det här kan du från förut
text: |
  Har du spelat in ett **makro** i Excel? Då har du redan sett ett program: en lista med steg som Excel upprepar i
  samma ordning varje gång du trycker på knappen. Ett recept, ett makro och ett Python-program är samma idé.
```

## Ett test

```forutsag
kod: Ett program är ...
kor: false
alternativ: ["en lista med instruktioner som datorn följer i ordning", "en bild på skärmen", "en sorts dator", "ett sätt för datorn att gissa vad du vill"]
ratt: 0
forklaring: "Ett program är instruktioner, i en bestämd ordning. Det är allt. Resten av kursen handlar om hur man skriver dem."
```

## Det här lärde du dig

- Ett program är en lista med instruktioner.
- Datorn följer dem uppifrån och ned, en i taget.
- Ordningen spelar roll.
