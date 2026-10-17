# Bidra

1. **Ärende först.** Varje ändring hör till ett ärende. Skapa ett om det saknas.
2. **Gren** `<typ>/<ärendenr>-<beskrivning>`, till exempel `feat/4-editor`. Pusha aldrig till `main`
   (`git config core.hooksPath .githooks` stoppar det lokalt).
3. **PR** med en titel enligt [Conventional Commits](https://www.conventionalcommits.org/)
   (`feat:`, `fix:`, `docs:`, `chore:` …) och `Closes #N` i beskrivningen. Workflown `PR` kontrollerar båda.
4. **Merge** först när `gh pr checks <nr>` är grön: `gh pr merge --squash`. Därefter
   `git switch main && git pull --prune` och radera den lokala grenen.

Kursinnehåll skrivs på svenska för någon som aldrig programmerat. Se pedagogikreglerna i
[docs/koncept.md](docs/koncept.md#2-pedagogiska-principer).
