# Drift och återställning

Kursen körs som en pod i k3s-klustret (`deploy/`, plattformssidan i `k3s_hosting` under `tenants/nuc/programmeringskurs`; den publika instansen är `programmeringskurs-publik`, se koncept.md kapitel 11).
Allt framsteg ligger i en SQLite-fil, `/data/kurs.db`, på en volym (`kurs-data`, storage class `local-path-sata`).

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

## Ta bort ett namn, uppdatera, rulla tillbaka

- **Ta bort ett namn** görs i appen ("Ta bort ett namn"), eller `DELETE /api/namn/<namn>` mot tjänsten.
- **Uppdatering:** varje merge till `main` publicerar en ny image (`sha-<7>`) och manifest; Flux tillämpar dem.
- **Rulla tillbaka:** sätt `ref.tag` i `tenants/nuc/programmeringskurs/sync.yaml` (i `k3s_hosting`) till en äldre `sha-<7>`.
- **Loggar:** en JSON-rad per anrop (metod, rutt, status, tid), aldrig namn. Hälsokontroll: `/api/halsa`.
