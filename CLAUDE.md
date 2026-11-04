# CLAUDE.md

Interaktiv nybörjarkurs i programmering och Python för webbläsaren. Läs README.md, docs/koncept.md och CONTRIBUTING.md.

## Arbetsflöde (obligatoriskt; rulesetet `main` på GitHub kräver PR och grön `check` + `pr`, resten är rutin)

- Jobba alltid mot ett ärende. Skapa ett om det saknas.
- Pusha aldrig till `main`. Gren: `<typ>/<ärendenr>-<beskrivning>`.
- PR-titel enligt Conventional Commits, beskrivning med `Closes #N`.
- Merga aldrig innan `gh pr checks <nr>` är helt grön. Använd `gh pr merge --squash`.
- Efter merge: `git switch main && git pull --prune` och radera lokal gren.
- Nya delar ska komma med tester i CI i samma PR. Alla övningar ska ha ett facit som klarar sin egen rättning.
- Actions låses till commit-SHA med versionskommentar (`uses: x@<sha> # vX.Y.Z`); runners explicit (`ubuntu-26.04`).

## Konventioner

- Kursinnehåll, dokumentation, ärenden och användargränssnitt på svenska. Kod och kodkommentarer på engelska.
- Kursens exempelkod har svenska namn på variabler och text, men Pythons egna ord (`print`, `if`, `for`) är engelska. Förklara det.
- Ingen insamling av uppgifter, ingen spårning, inga externa tjänster vid körning. Allt som behövs levereras med sidan.
- Allt versionslåst (npm-paket, Pyodide, GitHub Actions).
- Installera **aldrig** verktyg på arbetsmaskinen. Bygg och test körs i containrar via `make`.
