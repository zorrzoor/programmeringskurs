// "Vem är du?" in the public instance, which has no Cloudflare Access in front: every name has a code that is shown once when
// the name is made. The list of names is a search (there can be thousands). No e-mail addresses, nothing can be recovered.
import { Api, ApiError } from "../api.ts";
import { glomKod, hamtaKod, sparaKod } from "../koder.ts";
import { cleanName, NAME_HELP } from "../names.ts";
import { clear, h } from "./dom.ts";
import { integritetsText } from "./integritet.ts";
import type { PickerOptions } from "./picker.ts";

const say = (el: HTMLElement, text: string) => {
  el.textContent = text;
};
const fel = (err: unknown): string => (err instanceof ApiError ? err.message : "Något gick fel.");

export function showPublicPicker(root: HTMLElement, { api, onPick }: PickerOptions): void {
  /** Puts what was just added to the root inside <main> (every page needs the landmark). */
  const asMain = () => {
    const main = h("main", { id: "innehall" });
    main.append(...root.childNodes);
    root.append(main);
  };
  const warnings = () =>
    h(
      "div",
      { class: "varning", role: "note" },
      h("p", {}, h("strong", {}, "Namnen syns för alla. "), "Alla som besöker sidan kan se listan med namn. Välj ett användarnamn som du hittar på, inte ditt riktiga namn."),
      h("p", {}, h("strong", {}, "Framsteg kan rensas vid månadsbyte. "), "Räkna inte med att det du gör här finns kvar för alltid."),
    );

  /** Opens a name with its code; the server checks it when the progress is loaded. */
  async function open(name: string, code: string, message: HTMLElement): Promise<void> {
    api.setCode(code);
    try {
      await api.getProgress(name);
    } catch (err) {
      api.setCode(null);
      if (err instanceof ApiError && err.code === "fel-kod") {
        glomKod(name);
        return say(message, "Koden stämmer inte.");
      }
      return say(message, fel(err));
    }
    sparaKod(name, code);
    onPick(name, code);
  }

  function render(): void {
    clear(root);
    api.setCode(null);
    const message = h("p", { role: "alert", class: "message" });
    const results = h("ul", { class: "names", "aria-label": "Namn som matchar" });
    const more = h("p", { class: "help" });
    const search = h("input", { id: "sok-namn", type: "text", autocomplete: "off", maxlength: "60" });
    let seq = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    async function find(): Promise<void> {
      const mine = ++seq;
      const q = search.value.trim();
      try {
        const { namn, totalt } = await api.searchNames(q);
        if (mine !== seq) return;
        clear(results);
        for (const n of namn) results.append(h("li", {}, h("button", { type: "button", class: "name", onclick: () => choose(n) }, n)));
        say(more, totalt !== undefined && totalt > namn.length ? `Visar ${namn.length} av ${totalt}. Skriv mer av namnet för att hitta rätt.` : namn.length === 0 && q !== "" ? "Inget namn matchar." : "");
      } catch (err) {
        if (mine === seq) say(message, fel(err));
      }
    }
    search.addEventListener("input", () => {
      clearTimeout(timer);
      timer = setTimeout(() => void find(), 200);
    });

    const nameInput = h("input", { id: "nytt-namn", type: "text", autocomplete: "off", maxlength: "60", "aria-describedby": "namnhjalp" });
    root.append(
      h("h1", {}, "Programmeringskurs"),
      h("h2", {}, "Vem är du?"),
      warnings(),
      h("h3", {}, "Jag har redan ett namn"),
      h("label", { for: "sok-namn" }, "Sök ditt användarnamn:"),
      search,
      results,
      more,
      h("h3", {}, "Jag är ny"),
      h(
        "form",
        {
          onsubmit: (e) => {
            e.preventDefault();
            void create(nameInput.value, message);
          },
        },
        h("label", { for: "nytt-namn" }, "Välj ett användarnamn (inte ditt riktiga namn):"),
        nameInput,
        h("button", { type: "submit" }, "Skapa"),
        h("p", { id: "namnhjalp", class: "help" }, NAME_HELP),
      ),
      message,
      h("p", {}, h("button", { type: "button", class: "link", onclick: confirmRemove }, "Ta bort ett namn"), " · ", h("button", { type: "button", class: "link", onclick: privacy }, "Integritet och personuppgifter")),
    );
    asMain();
    void find();
    search.focus();
  }

  function privacy(): void {
    clear(root);
    root.append(h("h1", {}, "Integritet och personuppgifter"), ...integritetsText(), h("p", {}, h("button", { type: "button", onclick: render }, "← Tillbaka")));
    asMain();
  }

  function choose(name: string): void {
    const stored = hamtaKod(name);
    if (stored !== null) {
      const message = h("p", { role: "alert", class: "message" });
      root.append(message);
      void open(name, stored, message).then(() => {
        if (message.textContent) askCode(name);
      });
      return;
    }
    askCode(name);
  }

  function askCode(name: string): void {
    clear(root);
    const message = h("p", { role: "alert", class: "message" });
    const code = h("input", { id: "kod", type: "text", autocomplete: "off", autocapitalize: "characters", spellcheck: false, "aria-describedby": "kodhjalp" });
    root.append(
      h("h1", {}, name),
      h(
        "form",
        {
          onsubmit: (e) => {
            e.preventDefault();
            void open(name, code.value, message);
          },
        },
        h("label", { for: "kod" }, "Din kod (tolv tecken, till exempel K7QM-4TXA-9R2D):"),
        code,
        h("button", { type: "submit" }, "Öppna"),
        h("p", { id: "kodhjalp", class: "help" }, "Har du tappat koden går det inte att få tillbaka namnet. Då får du skapa ett nytt namn."),
      ),
      message,
      h("p", {}, h("button", { type: "button", onclick: render }, "Tillbaka")),
    );
    asMain();
    code.focus();
  }

  async function create(raw: string, message: HTMLElement): Promise<void> {
    const name = cleanName(raw);
    if (name === null) return say(message, NAME_HELP);
    try {
      const created = await api.createName(name);
      if (created.kod === undefined) return say(message, "Servern skickade ingen kod. Försök igen.");
      showCode(created.namn, created.kod);
    } catch (err) {
      if (err instanceof ApiError && err.code === "namnet-finns") return say(message, "Det namnet finns redan. Sök efter det och skriv din kod, eller välj ett annat namn.");
      say(message, fel(err));
    }
  }

  /** The code is shown once and can not be recovered: sparaKod keeps it on this device only. */
  function showCode(name: string, code: string): void {
    clear(root);
    sparaKod(name, code);
    root.append(
      h("h1", {}, `Välkommen, ${name}`),
      h("p", {}, "Det här är din kod:"),
      h("p", { class: "kodruta" }, h("code", { id: "din-kod" }, code)),
      h("p", {}, h("strong", {}, "Spara koden nu. "), "Den visas bara en gång och det går inte att återställa den. Utan den kommer du inte åt ditt namn från en annan dator eller om du rensar webbläsaren."),
      h("p", {}, h("button", { type: "button", onclick: () => onPick(name, code) }, "Jag har sparat koden")),
    );
    asMain();
  }

  function confirmRemove(): void {
    clear(root);
    const message = h("p", { role: "alert", class: "message" });
    const name = h("input", { id: "ta-bort-val", type: "text", autocomplete: "off", maxlength: "60" });
    const code = h("input", { id: "ta-bort-kod", type: "text", autocomplete: "off", autocapitalize: "characters", spellcheck: false });
    root.append(
      h("h1", {}, "Ta bort ett namn"),
      h("p", {}, "Allt framsteg för namnet raderas och det går inte att ångra. Koden bekräftar att det är ditt."),
      h("label", { for: "ta-bort-val" }, "Vilket namn?"),
      name,
      h("label", { for: "ta-bort-kod" }, "Koden för namnet:"),
      code,
      message,
      h(
        "p",
        {},
        h(
          "button",
          {
            type: "button",
            class: "danger",
            onclick: () => {
              const n = cleanName(name.value);
              if (n === null) return say(message, NAME_HELP);
              api.setCode(code.value);
              void api.deleteName(n).then(
                () => {
                  glomKod(n);
                  render();
                },
                (err: unknown) => {
                  api.setCode(null);
                  say(message, err instanceof ApiError && err.code === "fel-kod" ? "Koden stämmer inte, så inget har raderats." : fel(err));
                },
              );
            },
          },
          "Radera",
        ),
        " ",
        h("button", { type: "button", onclick: render }, "Avbryt"),
      ),
    );
    asMain();
    name.focus();
  }

  render();
}

export type { Api };
