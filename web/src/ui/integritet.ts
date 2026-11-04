// The privacy text of the public instance (kursen.feuerliden.se). The private instance sits behind Cloudflare Access
// and has no such page. Keep it in line with docs/koncept.md chapter 11 and with what the server really stores.
import { h } from "./dom.ts";

export const KONTAKT_URL = "https://github.com/zorrzoor/programmeringskurs/issues/new";
const CLOUDFLARE_URL = "https://www.cloudflare.com/privacypolicy/";
export const SENAST_ANDRAD = "2026-11-04";

/** The text itself, to be put on a page of its own (in the app or before a name is chosen). */
export function integritetsText(): HTMLElement[] {
  const lank = (href: string, text: string) => h("a", { href, target: "_blank", rel: "noopener noreferrer" }, text);
  return [
    h("p", {}, "Kursen samlar inte in mer än det som behövs för att spara dina framsteg. Här står vad det är."),
    h("h2", {}, "Använd ett användarnamn, inte ditt riktiga namn"),
    h("p", {}, "Välj ett påhittat användarnamn. Det syns för alla som besöker sidan, och du ska inte kunna kännas igen på det. Skriv heller inga personuppgifter i övningarnas kod."),
    h("h2", {}, "Vad servern sparar"),
    h(
      "ul",
      {},
      h("li", {}, "Användarnamnet och när det skapades."),
      h("li", {}, "Dina framsteg: koden och svaren du skriver i övningarna, vilka övningar som är klara och din senaste lektion."),
      h("li", {}, "En avhuggen version (hash) av din åtkomstkod. Själva koden sparas inte, och därför går den inte att få tillbaka om du tappar den."),
    ),
    h("p", {}, "Inga mejladresser, ingen statistik och inga IP-adresser sparas i databasen. Namn som skapats men aldrig använts tas bort efter ett dygn. Framsteg kan rensas vid månadsbyte."),
    h("h2", {}, "IP-adresser och missbruksskydd"),
    h("p", {}, "För att hindra att en besökare skapar tusentals namn räknar servern hur många namn varje besökare skapar. Den räknar med en hash av IP-adressen och ett slumpmässigt salt som bara finns i minnet. Hashen försvinner när servern startar om och skrivs aldrig till databasen eller loggen. Serverns egna loggrader innehåller bara metod, adress, svarskod och svarstid, inga IP-adresser och inga namn."),
    h("h2", {}, "Cloudflare"),
    h("p", {}, "Trafiken till sidan går via Cloudflare, som sköter namnuppslagning och förmedlar anslutningen till servern. Cloudflare ser därför din IP-adress och det du skickar, och kan ha egna loggar. Läs mer i ", lank(CLOUDFLARE_URL, "Cloudflares integritetspolicy"), ". Förutom Cloudflare skickas ingenting till någon annan, och sidan läser inga externa teckensnitt eller skript."),
    h("h2", {}, "Cookies och webbläsarens lagring"),
    h("p", {}, "Sidan använder inga cookies. Den sparar fyra poster i webbläsarens lokala lagring (localStorage), och bara på din enhet:"),
    h(
      "ul",
      {},
      h("li", {}, h("code", {}, "kurs.koder"), ": åtkomstkoderna för namnen du skapat, så att du slipper skriva dem varje gång."),
      h("li", {}, h("code", {}, "kurs.namn"), ": vilket namn du senast använde."),
      h("li", {}, h("code", {}, "kurs.ko.<namn>"), ": ändringar som väntar på att sparas när du är offline."),
      h("li", {}, h("code", {}, "kurs-visning"), ": tema och textstorlek."),
    ),
    h("p", {}, "Allt detta behövs för att kursen ska fungera som du har begärt, och inget används för spårning. Därför frågar vi inte om samtycke. Du kan rensa posterna när som helst i webbläsarens inställningar, men då måste du skriva in dina koder igen."),
    h("h2", {}, "Var uppgifterna finns och vem som ansvarar"),
    h("p", {}, "Servern är en privat dator hemma hos den som driver kursen, inte hos ett molnföretag. Kursen drivs av en privatperson (GitHub-kontot ", lank("https://github.com/zorrzoor", "zorrzoor"), ") som är personuppgiftsansvarig för uppgifterna ovan."),
    h("h2", {}, "Radera och rätta"),
    h("p", {}, "Du kan själv radera ditt användarnamn och alla framsteg med din kod: välj ", h("em", {}, "Ta bort ett namn"), " där du väljer namn. Det går inte att ångra. Utan koden kan ingen veta att namnet är ditt, så ingen annan kan radera eller lämna ut det åt dig."),
    h("h2", {}, "Barn"),
    h("p", {}, "Är du under 13 år: be en vuxen hjälpa dig, och använd ett påhittat användarnamn."),
    h("h2", {}, "Frågor och kontakt"),
    h("p", {}, "Har du frågor, eller tror du att ett riktigt namn har hamnat i listan? ", lank(KONTAKT_URL, "Skapa ett ärende"), " i projektet på GitHub. Ärenden är offentliga, så skriv inga personuppgifter där. Skriv bara vilket användarnamn det gäller, så tar jag bort det."),
    h("p", { class: "help" }, `Senast ändrad ${SENAST_ANDRAD}.`),
  ];
}

/** As a page of the app (#/integritet), for someone who has chosen a name. */
export function visaIntegritet(rot: HTMLElement): void {
  rot.replaceChildren(h("h1", { tabindex: "-1", id: "sidtitel" }, "Integritet och personuppgifter"), ...integritetsText(), h("p", {}, h("button", { type: "button", class: "sekundar", onclick: () => history.back() }, "← Tillbaka")));
}
