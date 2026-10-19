# Vad som behövs från ägaren (kursen)

Allt här är sådant som inte går att göra själv i repot eller som är ett beslut. Arbetet fortsätter tills det tar stopp
och det som stoppar står här. Svara gärna som kommentar i ärendet, så tar jag vid.

**Så är stegen skrivna:** varje steg anger *repo*, *gren* och *kommando*, och att det körs i din egen kopia av repot
(`~/repos/<repo>`). Står det en gren, byt till den först (`git fetch && git switch <gren>`) och byt tillbaka till `main`
när du är klar (`git switch main`). Står det inget om gren gäller `main`. Stämmer något inte med vad du ser: stanna och
skriv i ärendet i stället för att gissa.

## Läget: kursen är driftsatt

Alla steg för att öppna kursen är gjorda (2026-10-18): pull-secret (A), plattformssidan mergad (C) och värdnamnet skapat
med `make tf-apply` (D). Steg B (fler e-postadresser) återstår bara när fler ska in.

- **Adress:** https://kurs.feuerliden.se. Du loggar in med din e-postadress (engångskod), välj eller skriv ett namn, och
  börja med **Modul 0**. Din adress finns redan i Access-listan.
- **Lägga till din fru:** lägg hennes e-postadress i `TF_VAR_access_emails`, steg B nedan (k3s_hosting#323). Tills dess kan hon
  använda kursen genom dig (samma inloggning på samma dator).
- **Köra lokalt utan inloggning** (om något är fel med adressen): i din egen kopia av `programmeringskurs`, på `main`, kör
  `make dev` och öppna http://localhost:8080.

### Steg B: e-postadresser

| Steg | Repo och gren | Kommando eller åtgärd | Efteråt |
|---|---|---|---|
| **B. Läsare** (vilka e-postadresser som släpps in) | `k3s_hosting`: ny gren **`chore/323-access-emails`** från `main` (filen är versionshanterad, krypterad, så ändringen går via PR) | `git switch main && git pull && git switch -c chore/323-access-emails`, sedan `make tf-secrets TF_STACK=cloudflare` (öppnar den krypterade filen `terraform/cloudflare/secrets.sops.env`): lägg adresserna i JSON-listan på raden `TF_VAR_access_emails=["a@x.se","b@y.se"]`, spara. Sedan `git add terraform/cloudflare/secrets.sops.env && git commit -m "chore: kursens läsare i Access-listan (#323)" && git push -u origin HEAD` och öppna en PR (`Closes #323` i beskrivningen) | Merga PR:en när CI är grön, sedan `git switch main && git pull`, och kör `make tf-apply TF_STACK=cloudflare` (eller säg till så gör jag det). Se k3s_hosting#323 |

## Övrigt

| Vad | Varför | Ärende |
|---|---|---|
| Läs `docs/koncept.md` (särskilt kapitel 4.5, 9.6 och 11) och säg till om något ska ändras | Dyrt att ändra efter att innehållet är skrivet | #29 |
| Provkör med en riktig nybörjare efter modul 2, 5 och hela kursen | Det enda sättet att veta om texten är begriplig | #27 |

## Gjort utan att du behövde göra något

- Repot, ärenden, koncept och arbetsordning. Bygge, tester, server, image och manifest. Beslut om åtkomst: Cloudflare Access (#26).

## Tillgänglighet

Genomgången med skärmläsare, tangentbord och zoom står i [docs/tillganglighet.md](tillganglighet.md) (ärende #90).
