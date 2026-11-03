# Ikonen

Kycklingen som hackar är ritad som SVG i `web/src/assets/ikon.svg` (sidans favicon och logotypen i sidhuvudet). PNG-versionerna
(`ikon-180.png` för iPhones hemskärm och `ikon-192.png` som reservfavicon) är renderade från den. `ikon-180.png` är renderad
från en kvadratisk variant (`rx="0"`), eftersom iOS rundar hörnen själv.

Ändrar du SVG:n, rendera om PNG:erna i en container (inget installeras på arbetsmaskinen). Lägg en kvadratisk kopia av SVG:n
som `ikon-kvadrat.svg` bredvid, i en tillfällig katalog `ut/` tillsammans med `ikon.svg`:

```sh
cat > ut/r.mjs <<'JS'
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, writeFileSync } from "node:fs";
const rendera = (fil, bredd, ut) => writeFileSync(ut, new Resvg(readFileSync(fil), { fitTo: { mode: "width", value: bredd } }).render().asPng());
rendera("/out/ikon-kvadrat.svg", 180, "/out/ikon-180.png");
rendera("/out/ikon.svg", 192, "/out/ikon-192.png");
JS
podman run --rm --userns=keep-id --user "$(id -u):$(id -g)" -e HOME=/tmp -v "$PWD/ut:/out:Z" -w /tmp docker.io/library/node:24-alpine \
  sh -c 'npm i --silent --no-audit --no-fund @resvg/resvg-js@2 && cp /out/r.mjs . && node r.mjs'
```

Kopiera sedan PNG-filerna till `web/src/assets/`. Filerna får en innehållshash i namnet när sidan byggs (Vite), så en ändrad ikon får ny adress och hamnar inte i webbläsarens cache (Cloudflare cachar statiska filer i fyra timmar).

**Licens:** ikonen ingår inte i repots licenser. Alla rättigheter är förbehållna, se [LICENSE-ICON.md](../LICENSE-ICON.md).
