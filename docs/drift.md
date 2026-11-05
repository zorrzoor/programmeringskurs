# Drift och återställning

Kursen körs som en pod i k3s-klustret (`deploy/`, plattformssidan i `k3s_hosting` under `tenants/nuc/programmeringskurs`; den publika instansen är `programmeringskurs-publik`, se koncept.md kapitel 11).
Vill du köra en egen instans: se [egen-instans.md](egen-instans.md). Allt framsteg ligger i en SQLite-fil, `/data/kurs.db`, på en volym (`kurs-data`, storage class `local-path-sata`).

## Säkerhetskopia

- Servern skriver en **konsistent kopia av databasen varje dygn** (och vid start) till `/data/backup/kurs-<datum>.db` och
  behåller de 7 senaste. Det skyddar mot misstag (ett borttaget namn, en trasig uppdatering), men inte mot att hela disken
  förloras. Kopian ligger på samma volym.
- Skydd mot förlorad disk är plattformens sak (backup av noden). Vill du ha en kopia utanför klustret: hämta en fil med
  `kubectl -n programmeringskurs cp <pod>:/data/backup/kurs-<datum>.db ./kurs.db` och spara den där du vill.

## Återställa

Appen har bara en pod och en skrivare, så stoppa den först:

```text
kubectl -n programmeringskurs scale deploy/kurs --replicas=0
# starta en tillfällig pod som monterar volymen kurs-data och kopiera tillbaka filen:
#   cp /data/backup/kurs-<datum>.db /data/kurs.db   (och ta bort kurs.db-wal / kurs.db-shm)
kubectl -n programmeringskurs scale deploy/kurs --replicas=1
```

Allt framsteg efter kopians tidpunkt går förlorat (högst ett dygn).

## Så publiceras en ny version

Ingen kopierar något för hand. Hela vägen från ändring till liveversion går genom CI:

1. **Ändring** görs på en gren och öppnas som PR (hör alltid till ett ärende). CI kör tester, kontroll av alla facit mot
   rättningen, webbläsartester och tillgänglighetskontroll, och bygger och provkör imagen. Utan grön CI går det inte att
   merga: rulesetet `main` på GitHub kräver det.
2. **Merge till `main`** startar jobbet `publish`. Det bygger imagen `ghcr.io/zorrzoor/programmeringskurs:sha-<7>`
   (de sju första tecknen i commiten), skriver in den taggen i `deploy/base/kustomization.yaml` och publicerar `deploy/` som
   en OCI-artefakt (`...-manifests:sha-<7>`, med taggen `main` flyttad dit).
3. **Flux i klustret** tittar på taggen `main` varje minut, hämtar den nya artefakten och tillämpar den. Det sker för båda
   instanserna: `programmeringskurs` (privat, rotens `kustomization.yaml`) och `programmeringskurs-publik` (`overlays/publik`).
   Podden startas om med den nya imagen och Flux väntar tills den är frisk. Räkna med några minuter från merge till live.
4. **Rulla tillbaka** gör man i `k3s_hosting` genom att peka `ref.tag` på en äldre `sha-<7>` (se nedan).

Nya versioner av beroenden kommer in på samma sätt: Renovate öppnar en PR varje måndag, och den mergas för hand när CI är grön.

## Ta bort ett namn, uppdatera, rulla tillbaka

- **Ta bort ett namn** görs i appen ("Ta bort ett namn"), eller `DELETE /api/namn/<namn>` mot tjänsten.
- **Uppdatering:** se [Så publiceras en ny version](#så-publiceras-en-ny-version).
- **Rulla tillbaka:** sätt `ref.tag` i `tenants/nuc/programmeringskurs/sync.yaml` (privat) och
  `tenants/nuc/programmeringskurs-publik/sync.yaml` (publik), båda i `k3s_hosting`, till en äldre `sha-<7>`. Databasen ligger
  kvar på volymen, så framsteg påverkas inte av en ny eller äldre version.
- **Loggar:** en JSON-rad per anrop (metod, rutt, status, tid), aldrig namn. Hälsokontroll: `/api/halsa`.
