# Vad som behövs från ägaren (kursen)

Allt här är sådant som inte går att göra själv i repot eller som är ett beslut. Arbetet fortsätter tills det tar stopp
och det som stoppar står här. Svara gärna som kommentar i ärendet, så tar jag vid.

| # | Vad | Varför | Ärende | Brådskande |
|---|---|---|---|---|
| 1 | **Lägg till din frus (och dina) e-postadresser** i `TF_VAR_access_emails` i `secrets.sops.env` i `k3s_hosting` (samma lista som vattenkoll använder) | Cloudflare Access släpper bara in adresser i listan; man får en engångskod via e-post | k3s_hosting#323 | Inte aktuellt än: strax före `tf-apply` |
| 2 | Slå samman utkast-PR:en i `k3s_hosting` (#322: namnrymd, nätverksregler, `kurs`-raden i Cloudflare-konfigurationen) och kör sedan `make tf-apply`. `tf-apply` kör jag aldrig själv | Värdnamnet `kurs` skapas i DNS, tunneln och Access bara av Terraform | #34 | Efter 3 |
| 3 | Ge klustret läsrätt till kursens paket: byt till utkast-grenen i `k3s_hosting` (`git fetch && git switch feat/321-tenant-programmeringskurs`, katalogen finns bara där), kör `make tenant-ghcr-pull NS=programmeringskurs` (frågar efter en *classic* PAT med endast `read:packages`), och committa och pusha den nya filen `tenants/nuc/programmeringskurs/ghcr-pull.sops.yaml` på den grenen | CI publicerar imagen och manifesten som privata paket; klustret behöver en pull-secret. Paketets synlighet går inte att ändra via API:t | #34 | **Först** (före merge av #322) |
| 4 | Provkör med en riktig nybörjare efter modul 2, 5 och hela kursen | Det enda sättet att veta om texten är begriplig | #27 | Efter modul 2 |
| 5 | Läs `docs/koncept.md` (särskilt kapitel 4.5, 9.6 och 11) och säg till om något ska ändras | Dyrt att ändra efter att innehållet är skrivet | #29 | Gärna tidigt |

## Gjort utan att du behövde göra något

- Repot, ärenden, koncept och arbetsordning. Bygge, tester och server utvecklas lokalt i containrar.
