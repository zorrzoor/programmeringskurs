# Vad som behövs från ägaren (kursen)

Allt här är sådant som inte går att göra själv i repot eller som är ett beslut. Arbetet fortsätter tills det tar stopp
och det som stoppar står här. Svara gärna som kommentar i ärendet, så tar jag vid.

**Så är stegen skrivna:** varje steg anger *repo*, *gren* och *kommando*, och att det körs i din egen kopia av repot
(`~/repos/<repo>`). Står det en gren, byt till den först (`git fetch && git switch <gren>`) och byt tillbaka till `main`
när du är klar (`git switch main`). Står det inget om gren gäller `main`. Stämmer något inte med vad du ser: stanna och
skriv i ärendet i stället för att gissa.

## Driftsättning av kursen: stegen i ordning

| Steg | Repo och gren | Kommando eller åtgärd | Efteråt |
|---|---|---|---|
| **A. Pull-secret** (klustret behöver läsa kursens privata paket) | `k3s_hosting`, gren **`feat/321-tenant-programmeringskurs`** (katalogen `tenants/nuc/programmeringskurs` finns bara på den grenen) | `git fetch && git switch feat/321-tenant-programmeringskurs`, sedan `make tenant-ghcr-pull NS=programmeringskurs` (frågar efter en *classic* PAT med enbart `read:packages`), sedan `git add tenants/nuc/programmeringskurs/ghcr-pull.sops.yaml && git commit -m "chore: ghcr-pull för programmeringskurs" && git push` | `git switch main` |
| **B. Läsare** (vilka e-postadresser som släpps in) | `k3s_hosting`: ny gren **`chore/323-access-emails`** från `main` (filen är versionshanterad, krypterad, så ändringen går via PR) | `git switch main && git pull && git switch -c chore/323-access-emails`, sedan `make tf-secrets TF_STACK=cloudflare` (öppnar den krypterade filen `terraform/cloudflare/secrets.sops.env`): lägg adresserna i JSON-listan på raden `TF_VAR_access_emails=["a@x.se","b@y.se"]`, spara. Sedan `git add terraform/cloudflare/secrets.sops.env && git commit -m "chore: kursens läsare i Access-listan (#323)" && git push -u origin HEAD` och öppna en PR (`Closes #323` i beskrivningen) | Merga PR:en när CI är grön, sedan `git switch main && git pull`. Se k3s_hosting#323 |
| **C. Slå samman plattformssidan** | GitHub: `zorrzoor/k3s_hosting`, PR **#322** (utkast) | Markera *Ready for review*, vänta på grön CI och merga. Flux tillämpar namnrymden och nätverksreglerna när PR:en är mergad | |
| **D. Skapa värdnamnet `kurs`** (DNS, tunnel, Access) | `k3s_hosting`, gren **`main`** (efter C) | `git switch main && git pull`, sedan `make tf-plan TF_STACK=cloudflare` (kontrollera att bara `kurs` läggs till) och `make tf-apply TF_STACK=cloudflare`. `tf-apply` kör jag aldrig själv | Öppna `https://kurs.feuerliden.se`, ange e-post, skriv engångskoden |

Ordning: **A, B, C, D.** Steg B (adresserna) är inte aktuellt än (k3s_hosting#323); gör A–D när du vill öppna kursen.

## Övrigt

| Vad | Varför | Ärende |
|---|---|---|
| Läs `docs/koncept.md` (särskilt kapitel 4.5, 9.6 och 11) och säg till om något ska ändras | Dyrt att ändra efter att innehållet är skrivet | #29 |
| Provkör med en riktig nybörjare efter modul 2, 5 och hela kursen | Det enda sättet att veta om texten är begriplig | #27 |

## Gjort utan att du behövde göra något

- Repot, ärenden, koncept och arbetsordning. Bygge, tester, server, image och manifest. Beslut om åtkomst: Cloudflare Access (#26).
