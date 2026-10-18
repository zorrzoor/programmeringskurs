# Vad som behövs från ägaren (kursen)

Allt här är sådant som inte går att göra själv i repot eller som är ett beslut. Arbetet fortsätter tills det tar stopp
och det som stoppar står här. Svara gärna som kommentar i ärendet, så tar jag vid.

| # | Vad | Varför | Ärende | Brådskande |
|---|---|---|---|---|
| 1 | **Besluta åtkomstsätt:** Cloudflare Access (e-postinloggning, fungerar överallt) eller bara lokalt nät | Appen har inget lösenord och får inte ligga öppet mot internet | #26 | Innan första driftsättningen |
| 2 | Slå samman och tillämpa plattformssidan i `k3s_hosting` (PR kommer): merge, och `make tf-apply` om Access eller DNS ändras | Namnrymd, värdnamn och nätverksregler ändras bara där. `tf-apply` kör jag aldrig själv | #34 | Efter 1 |
| 3 | Ge klustret läsrätt till kursens paket: kör `make tenant-ghcr-pull NS=programmeringskurs` i `k3s_hosting` (frågar efter en *classic* PAT med endast `read:packages`) | CI publicerar imagen och manifesten som privata paket; klustret behöver en pull-secret. Paketets synlighet går inte att ändra via API:t | #34 | Före första driftsättningen |
| 4 | Provkör med en riktig nybörjare efter modul 2, 5 och hela kursen | Det enda sättet att veta om texten är begriplig | #27 | Efter modul 2 |
| 5 | Läs `docs/koncept.md` (särskilt kapitel 4.5, 9.6 och 11) och säg till om något ska ändras | Dyrt att ändra efter att innehållet är skrivet | #29 | Gärna tidigt |

## Gjort utan att du behövde göra något

- Repot, ärenden, koncept och arbetsordning. Bygge, tester och server utvecklas lokalt i containrar.
