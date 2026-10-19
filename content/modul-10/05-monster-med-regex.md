---
titel: "Hitta mönster med regex"
mal: "Efter den här lektionen kan du söka efter mönster i text, till exempel tal, datum och e-postadresser."
---

Det här är den svåraste lektionen i kursen och den är helt valfri. Du behöver bara de enklaste delarna.

## Prova först

Kör koden. Vilka delar av texten hittas?

```python-exempel
import re

text = "Order 123 och order 4567 skickades den 18 oktober"
print(re.findall(r"\d+", text))
```

## Reguljära uttryck

Ett **reguljärt uttryck** (regex) är ett mönster som beskriver hur text ska se ut, i stället för exakt vilken text. Modulen `re` söker med mönster. Skriv mönstret som `r"..."` (ett **rått** textvärde) så att bakstrecken (`\`) tas som de står.

Byggstenarna du behöver:

- `\d` är en siffra, `\D` är något som **inte** är en siffra, `\w` är en bokstav eller siffra, och `\s` är ett mellanslag eller liknande.
- `+` efter något betyder "ett eller flera": `\d+` är ett helt tal.
- `{4}` betyder exakt fyra: `\d{4}` är fyra siffror.
- De flesta andra tecken betyder sig själva: `-` är ett bindestreck och `@` ett snabel-a. Några tecken har en särskild betydelse. Punkt betyder till exempel *vilket tecken som helst*, så en riktig punkt skrivs `\.`.

Funktionerna:

- `re.findall(mönster, text)` ger en lista med **alla** träffar.
- `re.search(mönster, text)` ger den första träffen, eller `None` om ingen finns, så att du kan skriva `if re.search(...):`.
- `re.sub(mönster, ersättning, text)` byter ut alla träffar mot något annat.

```ruta
rubrik: Du kanske känner igen det från Excel
text: |
  Det liknar jokertecknen i Excel (* och ?) när du söker, men mycket mer kraftfullt. Äldre Excel har inga reguljära uttryck, men i nyare Microsoft 365 finns funktioner som REGEXTEST som använder samma sorts mönster (namnen kan variera med version och språkinställning).
```

## Fråga

```forutsag
kod: |
  import re

  print(re.sub(r"\d", "#", "tel 070-123"))
kor: true
alternativ: ["tel ###-###", "tel #", "tel 070-123", "tel ###"]
ratt: 0
forklaring: "Mönstret \\d är en enda siffra, och sub byter ut varje siffra mot ett #. Bokstäverna och bindestrecket påverkas inte."
```

## Din tur

```ovning
id: m10-regex-summa
uppgift: "Skriv ut summan av alla heltal som finns i texten."
start: |
  import re

  text = "Köpte 3 äpplen och 12 päron för 45 kr"
ratta: {"utdata": "60"}
ledtradar:
  - "Hitta alla tal med ett mönster, och lägg ihop dem."
  - "re.findall(r\"\\d+\", text) ger texter, så gör om dem med int(...)."
  - "for tal in re.findall(r\"\\d+\", text): total = total + int(tal)"
facit: |
  import re

  text = "Köpte 3 äpplen och 12 päron för 45 kr"
  total = 0
  for tal in re.findall(r"\d+", text):
      total = total + int(tal)
  print(total)
```

```ovning
id: m10-regex-mellanslag
uppgift: "Texten har för många mellanslag. Skriv ut den med exakt ett mellanslag mellan varje ord."
start: |
  import re

  text = "ett   två    tre"
ratta: {"utdata": "ett två tre"}
ledtradar:
  - "Byt ut varje följd av mellanslag mot ett enda."
  - "\\s+ är ett eller flera mellanslag."
  - "print(re.sub(r\"\\s+\", \" \", text))"
facit: |
  import re

  text = "ett   två    tre"
  print(re.sub(r"\s+", " ", text))
```

```ovning
id: m10-regex-datum
uppgift: "Skriv en funktion `har_datum(text)` som returnerar `True` om texten innehåller ett datum på formen `2026-10-18` (fyra siffror, bindestreck, två siffror, bindestreck, två siffror) och annars `False`."
start: |
  import re

  # skriv din funktion här
ratta: {"funktion": "har_datum", "tester": [{"in": ["Mötet är 2026-10-18 klockan nio"], "ut": true}, {"in": ["Inget datum här"], "ut": false}, {"in": ["18-10-2026"], "ut": false}]}
ledtradar:
  - "re.search ger None om mönstret inte finns, och då är villkoret i en if falskt."
  - "Mönstret är fyra siffror, bindestreck, två siffror, bindestreck, två siffror."
  - "if re.search(r\"\\d{4}-\\d{2}-\\d{2}\", text): return True, och return False efteråt."
facit: |
  import re

  def har_datum(text):
      if re.search(r"\d{4}-\d{2}-\d{2}", text):
          return True
      return False
```

```ovning
id: m10-regex-epost
uppgift: "Skriv en funktion `hitta_epost(text)` som returnerar en lista med alla e-postadresser i texten. Här räcker mönstret ord, snabel-a, ord, punkt, ord."
start: |
  import re

  # skriv din funktion här
ratta: {"funktion": "hitta_epost", "tester": [{"in": ["Mejla anna@test.se eller bo@firma.com"], "ut": ["anna@test.se", "bo@firma.com"]}, {"in": ["ingen adress"], "ut": []}]}
ledtradar:
  - "Använd findall, så får du alla träffar i en lista."
  - "Mönstret är \\w+ @ \\w+ \\. \\w+, utan mellanslag."
  - "return re.findall(r\"\\w+@\\w+\\.\\w+\", text)"
facit: |
  import re

  def hitta_epost(text):
      return re.findall(r"\w+@\w+\.\w+", text)
```

## Det här lärde du dig

- Ett reguljärt uttryck beskriver ett mönster: `\d` är en siffra, `\w` en bokstav eller siffra, `+` betyder "ett eller flera".
- `re.findall` hittar alla träffar, `re.search` den första, och `re.sub` byter ut träffar.
- Skriv mönstret som `r"..."` så att bakstreck tas som de står.
