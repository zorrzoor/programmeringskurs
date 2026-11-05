# Köra en egen instans

Kursen är öppen källkod, och vem som helst kan köra en egen kopia. Det här är tips och väl valda länkar, **inte** en
fullständig guide. Börja längst upp och gå bara så långt du behöver: en container räcker för de flesta.

| Du vill | Gå till |
|---|---|
| Prova eller köra för dig själv | [1. En container](#1-en-container-enklast) |
| Köra i ett eget Kubernetes-kluster | [3. Kubernetes](#3-kubernetes-med-deploy) |
| Låta ändringar rullas ut automatiskt | [4. Flux](#4-flux-så-gör-jag-här) |
| Nå sidan utifrån utan att öppna något hemma | [5. Cloudflare Tunnel](#5-cloudflare-tunnel-så-gör-jag-här) |

## 1. En container (enklast)

Inget Kubernetes och inget Flux behövs. Servern är en liten Node.js-process med en SQLite-fil.

```text
make image                     # bygger programmeringskurs:dev lokalt (i container, inget installeras)
make dev                       # eller: kör direkt på http://localhost:8080 med en databas som slängs

podman run -d --name kurs -p 8080:8080 -v kurs-data:/data programmeringskurs:dev
```

- Allt framsteg ligger i `/data/kurs.db`. Montera en volym på `/data`. Imagen kör som användare `1000:1000`, så volymen
  måste gå att skriva för den.
- **Sätt HTTPS framför.** Kursen använder funktioner som webbläsaren bara tillåter på `localhost` eller över HTTPS (till
  exempel `input()` i Python-arbetaren). På en vanlig `http://`-adress i hemmanätet fungerar inte allt. En omvänd proxy
  (Caddy, Traefik, nginx) eller en [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)
  löser det.
- Inget konto eller lösenord finns i appen. Vill du stänga ute andra: lägg åtkomstskyddet utanför appen, som jag gör med
  Cloudflare Access för den privata instansen.

### Inställningar (miljövariabler)

| Variabel | Betyder |
|---|---|
| `KURS_LAGE` | `privat` (standard, för dig och dina nära) eller `publik` (kod per namn, sökbar namnlista, varningar) |
| `MAX_NAMES` | Högsta antal namn (standard 50) |
| `WRITES_PER_MINUTE` | Skydd mot för många sparningar (standard 300) |
| `NEW_NAMES_PER_IP_PER_DAY`, `NEW_NAMES_PER_HOUR`, `UNUSED_NAME_HOURS` | Skydd mot massskapade namn i publikt läge (av om de saknas) |
| `NAMES_CLOSED=1` | Stänger nyskapande av namn direkt |
| `DATABASE_PATH`, `BACKUP_DIR`, `PORT` | Var databasen och dygnskopiorna ligger, och vilken port |

Exakta regler och standardvärden står i `server/config.ts`, förklaringen i [koncept.md](koncept.md) kapitel 11.

## 2. Byt det som är mitt innan du publicerar

Kör du en instans som andra använder, byt dessa saker först:

- **Integritetstexten** (`web/src/ui/integritet.ts`): den säger vem som är personuppgiftsansvarig, nämner Cloudflare och
  pekar kontaktvägen till det här repots ärenden. Skriv in dina egna uppgifter, och ta bort det som inte stämmer hos dig.
- **Ikonen** (kycklingen som hackar) ingår **inte** i licensen, se [LICENSE-ICON.md](../LICENSE-ICON.md). Byt ut den mot din egen.
- **Adresserna** `kurs.feuerliden.se` och `kursen.feuerliden.se` i `deploy/overlays/*/ingress.yaml`.

## 3. Kubernetes (med `deploy/`)

`deploy/` är en [kustomize](https://kubectl.docs.kubernetes.io/references/kustomize/)-bas (`deploy/base`) med två
överlägg: `overlays/privat` och `overlays/publik`. Se vad som skulle läggas in, och lägg in det:

```text
kubectl kustomize deploy/overlays/publik | less
kubectl apply -k deploy/overlays/publik
make validate                  # kustomize + kubeconform mot Kubernetes- och CRD-scheman
```

Det här är gjort för **mitt** kluster och måste anpassas. Det som oftast byts:

- **Imagen.** `deploy/base/kustomization.yaml` pekar på `ghcr.io/zorrzoor/programmeringskurs`, och den är privat. Bygg din
  egen: CI i en fork publicerar till `ghcr.io/<du>/programmeringskurs`, eftersom `ci.yml` använder repots eget namn. Byt
  `images:` och `image:` i `base/deployment.yaml`, och ta bort `imagePullSecrets` om paketet är publikt.
- **Certifikat och Traefik.** Trafiken mellan Traefik och podden är krypterad med ett certifikat från cert-manager
  (`ClusterIssuer` med namnet `internal-ca`) och en `ServersTransport` för Traefik. Har du inte det: ta bort
  `certificate.yaml`, `serverstransport.yaml`, `TLS_*`-variablerna och TLS-volymen, och låt Service och Ingress prata vanlig
  HTTP mot port 8080. Det har jag inte provat, så kontrollera själv.
- **Lagring.** `pvc.yaml` begär `local-path-sata`, en lagringsklass i mitt kluster. Byt till en som finns hos dig.
- **Namnrymden** ingår i tre namn (certifikatet, `ServersTransport` och en annotation på Service). Överlägget för publik
  instans lägger om dem med patchar. Byter du namnrymd, byt dem också. `scripts/validate-deploy.sh` kontrollerar att
  instanserna inte läcker varandras värdnamn.
- **En replik och `Recreate`** är avsiktligt: en SQLite-fil har en skrivare. Skala inte upp utan att byta databas.

## 4. Flux (så gör jag här)

[Flux](https://fluxcd.io/flux/get-started/) håller klustret likadant som det som står i Git eller i ett OCI-paket, och
rullar ut ändringar av sig själv. Så är det kopplat här:

1. CI bygger imagen `sha-<7>` och publicerar `deploy/` som ett OCI-paket
   (`ghcr.io/<du>/programmeringskurs-manifests`) med taggarna `sha-<7>` och `main`, med
   [`flux push artifact`](https://fluxcd.io/flux/cheatsheets/oci-artifacts/). Imagetaggen skrivs in i paketet, så paketet och
   imagen alltid hör ihop.
2. I klustret finns en [`OCIRepository`](https://fluxcd.io/flux/components/source/ocirepositories/) som följer taggen `main`
   och en [`Kustomization`](https://fluxcd.io/flux/components/kustomize/kustomizations/) som tillämpar den. En per instans:
   privat använder `path: ./`, publik `path: ./overlays/publik`.

Ett minimalt exempel för den publika instansen:

```yaml
apiVersion: source.toolkit.fluxcd.io/v1
kind: OCIRepository
metadata:
  name: kurs-publik
  namespace: kurs-publik
spec:
  interval: 1m                       # hur ofta Flux tittar efter en ny version
  url: oci://ghcr.io/<du>/programmeringskurs-manifests
  ref:
    tag: main                        # byt till en sha-<7> för att pinna eller rulla tillbaka
  secretRef:
    name: ghcr-pull                  # behövs bara om paketet är privat
---
apiVersion: kustomize.toolkit.fluxcd.io/v1
kind: Kustomization
metadata:
  name: kurs-publik
  namespace: kurs-publik
spec:
  interval: 10m
  sourceRef:
    kind: OCIRepository
    name: kurs-publik
  path: ./overlays/publik
  prune: true                        # tar bort det som försvinner ur paketet
  wait: true                         # väntar tills podden är frisk
  targetNamespace: kurs-publik
```

Tips:

- **Kom igång:** [`flux bootstrap github`](https://fluxcd.io/flux/installation/bootstrap/github/) installerar Flux och
  kopplar det till ett repo. Det finns också bootstrap för andra Git-värdar.
- **Se läget:** `flux get sources oci -A`, `flux get kustomizations -A` och `flux logs`. Tvinga en ny koll med
  `flux reconcile source oci kurs-publik`.
- **Rulla tillbaka:** peka `ref.tag` på en äldre `sha-<7>`. Databasen ligger kvar på volymen.
- **Pausa:** `flux suspend kustomization kurs-publik` stoppar utrullning medan du felsöker. Glöm inte `flux resume`.
- **Privat paket:** skapa en pull-hemlighet med `flux create secret oci` (eller en vanlig `docker-registry`-hemlighet) och
  ge den namnet du anger i `secretRef`. Gör paketet publikt så behövs ingen.
- **Utan OCI-paket:** enklare att komma igång är en
  [`GitRepository`](https://fluxcd.io/flux/components/source/gitrepositories/) som pekar på din fork, med
  `path: ./deploy/overlays/publik`. Då ligger imagetaggen i `base/kustomization.yaml` (`newTag`), och du uppdaterar den själv
  eller låter [Flux image automation](https://fluxcd.io/flux/components/image/) göra det. Mitt flöde pinnar taggen i paketet
  i stället, så att Git inte fylls med en commit per version.

## 5. Cloudflare Tunnel (så gör jag här)

Kursen körs på en dator hemma, men jag har **ingen port öppen i routern** och min hemadress syns inte. Det löser en
[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/): ett litet program
(`cloudflared`) i klustret ringer *ut* till Cloudflare och håller en anslutning öppen. Besökare går till Cloudflare, som
skickar trafiken genom den anslutningen.

```text
Besökare ──HTTPS──▶ Cloudflare ──tunnel (utgående)──▶ cloudflared i klustret ──▶ Traefik ──▶ kursen
```

Vad det ger: ingen öppen port och ingen publik IP-adress hemma, HTTPS ordnas av Cloudflare, och trafiken kan
skyddas med [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) utan att appen behöver
ett lösenord. Priset: Cloudflare ser trafiken (det står i [integritetstexten](../web/src/ui/integritet.ts)), och om
Cloudflare eller tunneln ligger nere når ingen sidan, men den fungerar fortfarande inne på det egna nätverket.

**Kom igång (enklaste vägen, i Cloudflares panel):** skapa en tunnel i Zero Trust under *Networks → Tunnels*
(menynamnen ändras ibland), följ [anvisningen för att komma igång](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/),
kör `cloudflared` med tunnelns token (som container eller i klustret) och lägg till ett *public hostname* som pekar på
tjänsten, till exempel `http://localhost:8080` eller `http://kurs:8080`. Du behöver ett eget domännamn hos Cloudflare.
Se också [hur tunnlar konfigureras](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/configure-tunnels/).

**Så gör jag:** tunneln, reglerna för vilket värdnamn som går vart och DNS-posterna (en proxad CNAME till
`<tunnel-id>.cfargotunnel.com`) beskrivs som kod med Terraform i mitt plattformsrepo i stället för att klickas ihop. Ett
värdnamn som inte finns i listan avvisas redan i `cloudflared`. Att allt ligger som kod gör att jag kan återskapa det.

**Åtkomst:**
- Den *privata* instansen ligger bakom Cloudflare Access: man anger sin e-postadress, får en engångskod och släpps in om
  adressen finns på listan ([policyer](https://developers.cloudflare.com/cloudflare-one/policies/access/policy-management/)).
  Appen vet inget om det, och namnen i den är därför ingen säkerhet.
- Den *publika* instansen har ingen Access. Det är därför den har kod per namn, gränser och en integritetstext.

**Tips och fallgropar:**
- Appen räknar nya namn per besökare med hjälp av headern `CF-Connecting-IP`, som Cloudflare sätter. Utan Cloudflare
  framför används anslutningens adress i stället (`server/app.ts`). Ligger det en annan proxy framför ser alla besökare då ut
  som en enda, så gränsen per besökare delas av alla. Höj den eller anpassa koden.
- Headern går att förfalska för den som når servern *utan* att gå via Cloudflare. Stäng därför direkt åtkomst (nätverksregler)
  så att allt går genom tunneln. Timgränsen gäller ändå.
- Starta `cloudflared` som egen tjänst med automatisk omstart, och övervaka den. Utan den är sidan onåbar utifrån.

Min plattform (namnrymder, nätverksregler, Cloudflare) ligger i ett eget repo och är **inte** något du behöver kopiera.
Det som hör till appen är `deploy/`, och det är det här dokumentet handlar om. Så publiceras en ny version hos mig:
[drift.md](drift.md#så-publiceras-en-ny-version).
