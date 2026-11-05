# Säkerhet

## Rapportera en sårbarhet

Rapportera privat via GitHub: fliken **Security** → **Report a vulnerability**. Skriv inte sårbarheten i ett öppet
ärende. Projektet sköts på fritiden, så räkna med svar inom ett par veckor.

## Vad som är känt och avsiktligt

- Den publika instansen (kursen.feuerliden.se) har ingen inloggning. Åtkomst till ett namn styrs av en kod som visas
  en gång. En förlorad kod kan inte återskapas, och det finns inga mejladresser.
- Namn är synliga för alla. Skriv inte ditt riktiga namn om du inte vill det.
- Kursen samlar inga uppgifter och använder inga externa tjänster vid körning. Se `docs/koncept.md`, kapitel 11.

## Beroenden och uppdateringar

Alla versioner är låsta (npm-paket inklusive Pyodide, container-images och GitHub Actions med commit-SHA). För att de inte
ska bli gamla och sårbara öppnar Renovate varje måndag PR:ar med nya versioner, grupperade per slag. Säkerhetsfixar för
kända sårbarheter kommer direkt. Varje PR går igenom hela CI (tester, webbläsartester, test av imagen) och mergas för
hand: inget uppdateras utan att allt är grönt. Nya huvudversioner av körmiljöer väljs för hand. På GitHub är Dependabot
alerts, secret scanning med push protection och privat sårbarhetsrapportering påslagna.
