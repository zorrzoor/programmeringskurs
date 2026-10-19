---
titel: "Arbeta med text"
mal: "Efter den här lektionen kan du dela, sätta ihop, rensa och söka i text."
---

## Prova först

Kör koden. Se vad varje rad gör med texten.

```python-exempel
mening = "  Python är kul  "
rent = mening.strip()
print(rent.upper())
print(rent.split())
print("-".join(rent.split()))
print(rent.replace("kul", "roligt"))
print(rent.startswith("Py"))
```

## Vad en text kan göra

Text i Python har många färdiga **metoder**: funktioner du anropar med en punkt efter texten.

- `strip()` tar bort mellanslag och radbyte i början och slutet, `lower()` och `upper()` byter till små eller stora bokstäver, och `title()` gör första bokstaven i varje ord stor.
- `split()` delar texten i en lista med ord, eller vid ett visst tecken: `"a,b,c".split(",")`.
- `"-".join(lista)` sätter ihop en lista med text, med `-` emellan.
- `replace("gammalt", "nytt")` byter ut en del av texten.
- `startswith("Py")` och `endswith("on")` kollar början och slutet, och `"ul" in text` kollar om en del finns.
- `text[::-1]` är texten baklänges (du kan klippa med `[a:b]` från modul 5, och `::-1` betyder "hela, i omvänd ordning").

Metoderna **ändrar inte** texten: de ger tillbaka en ny. Spara resultatet i en variabel om du vill behålla det.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  De motsvarar textfunktionerna i Excel: RENSA, GEMENER, VERSALER, BYT.UT, TEXTDELA (bara i Microsoft 365) och TEXTJOIN, och `title()` motsvarar INITIAL. Funktionernas exakta namn kan variera med Excels version och språkinställning. Skillnaden är att du kan kedja dem: text.strip().lower().split().
```

## Fråga

```forutsag
kod: |
  print("a-b-c".split("-"))
kor: true
alternativ: ["['a', 'b', 'c']", "a b c", "['a-b-c']", "['-', '-']"]
ratt: 0
forklaring: "split delar texten vid varje bindestreck och ger en lista med delarna, utan bindestrecken."
```

## Din tur

```ovning
id: m10-text-antal-ord
uppgift: "Skriv ut hur många ord texten innehåller."
start: |
  text = "det är en fin dag idag"
ratta: {"utdata": "6"}
ledtradar:
  - "Dela texten i ord, och räkna orden i listan."
  - "split() ger listan, och len ger antalet."
  - "print(len(text.split()))"
facit: |
  text = "det är en fin dag idag"
  print(len(text.split()))
```

```ovning
id: m10-text-titel
uppgift: "Skriv ut texten med stor första bokstav i varje ord."
start: |
  text = "programmering är roligt"
ratta: {"utdata": "Programmering Är Roligt"}
ledtradar:
  - "Det finns en färdig metod för det."
  - "Den heter title()."
  - "print(text.title())"
facit: |
  text = "programmering är roligt"
  print(text.title())
```

```ovning
id: m10-text-palindrom
uppgift: "Skriv en funktion `ar_palindrom(text)` som returnerar `True` om texten är samma framlänges och baklänges. Stora och små bokstäver och mellanslag ska inte spela roll."
start: |
  # skriv din funktion här
ratta: {"funktion": "ar_palindrom", "tester": [{"in": ["Anna"], "ut": true}, {"in": ["Hej"], "ut": false}, {"in": ["Ni talar bra latin"], "ut": true}]}
ledtradar:
  - "Rensa texten först: små bokstäver och inga mellanslag."
  - "Jämför den rensade texten med samma text baklänges."
  - "rent = text.lower().replace(\" \", \"\") och return rent == rent[::-1]"
facit: |
  def ar_palindrom(text):
      rent = text.lower().replace(" ", "")
      return rent == rent[::-1]
```

```ovning
id: m10-text-forkorta
uppgift: "Skriv en funktion `forkorta(text, n)` som returnerar texten oförändrad om den har högst `n` tecken, och annars de första `n` tecknen följda av `...`."
start: |
  # skriv din funktion här
ratta: {"funktion": "forkorta", "tester": [{"in": ["hej", 5], "ut": "hej"}, {"in": ["programmering", 7], "ut": "program..."}, {"in": ["abc", 3], "ut": "abc"}]}
ledtradar:
  - "Jämför längden med n med en if."
  - "Är texten kort nog returnerar du den som den är."
  - "return text[:n] + \"...\" när den är för lång."
facit: |
  def forkorta(text, n):
      if len(text) <= n:
          return text
      return text[:n] + "..."
```

## Det här lärde du dig

- Text har färdiga metoder som `strip`, `lower`, `split`, `replace` och `startswith`.
- `"-".join(lista)` sätter ihop en lista med text till en enda text.
- Metoderna ändrar inte texten, de ger en ny: spara resultatet.
