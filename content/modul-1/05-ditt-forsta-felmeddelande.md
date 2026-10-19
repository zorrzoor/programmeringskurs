---
titel: Ditt första felmeddelande
mal: Efter den här lektionen kan du läsa ett felmeddelande, hitta raden det gäller och rätta felet.
---

## Prova först: ett fel med flit

Kör koden. Den har ett fel, och det är meningen.

```python-exempel
print("Hej)
```

Bra! Nu fick du ett fel. Då kan vi läsa vad datorn säger.

## Så läser du ett felmeddelande

Felmeddelandet berättar tre saker:

1. **Vad** som är fel, med en förklaring på svenska och Pythons egen text under.
2. **Vilken rad** det gäller. Rätta den raden, eller raden strax innan.
3. **Ofta hur** du rättar det, i tipset.

Här saknades det avslutande citattecknet. En text ska börja och sluta med samma citattecken.

## Några vanliga fel

Kör varje exempel och läs vad Python säger.

```python-exempel
prnt("Hej")
```

Python känner inte till `prnt`: det är ett stavfel. (`Print` med stort P ger samma fel: Python skiljer på stora och små bokstäver.)

```python-exempel
print("Hej"
```

Parentesen som öppnas stängs aldrig.

```forutsag
kod: |
  Print("Hej")
alternativ: ["Hej skrivs ut", "Python känner inte till namnet Print (stort P)", "Ingenting händer, men inget fel"]
ratt: 1
forklaring: "Python skiljer på stora och små bokstäver. print med litet p är funktionen, Print är något annat som Python inte känner till."
```

## Din tur: rätta felen

```ovning
id: m1-fel-citattecken
uppgift: "Rätta felet så att programmet skriver ut `Hej`."
start: |
  print("Hej)
ratta: {utdata: "Hej"}
ledtradar:
  - Läs felmeddelandet. Vad saknas?
  - En text ska börja och sluta med citattecken.
  - Lägg till ett citattecken efter Hej.
facit: |
  print("Hej")
```

```ovning
id: m1-fel-stavning
uppgift: "Rätta felet så att programmet skriver ut `Hej då`."
start: |
  prnt("Hej då")
ratta: {utdata: "Hej då"}
ledtradar:
  - Python känner inte till ordet längst till vänster. Läs felmeddelandet.
  - Det är ett stavfel i funktionens namn.
  - Funktionen heter print.
facit: |
  print("Hej då")
```

```ovning
id: m1-fel-parentes
uppgift: "Det är ett fel någonstans i koden. Rätta det så att tre rader skrivs ut: `Rad 1`, `Rad 2` och `Rad 3`."
start: |
  print("Rad 1")
  print("Rad 2"
  print("Rad 3")
ratta: {utdata: "Rad 1\nRad 2\nRad 3"}
ledtradar:
  - Läs felmeddelandet och titta på vilken rad det pekar på.
  - En parentes öppnas men stängs aldrig.
  - Lägg till ) i slutet av raden med "Rad 2".
facit: |
  print("Rad 1")
  print("Rad 2")
  print("Rad 3")
```

## Det här lärde du dig

- Ett felmeddelande är en hjälp: det säger vad och var.
- Vanliga fel är saknade citattecken och parenteser, och stavfel.
- Python skiljer på stora och små bokstäver.
