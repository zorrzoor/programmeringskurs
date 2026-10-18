// "Vem är du?": choose an existing name, add a new one, or remove one (start over). No password: whoever
// can open the page can open every name (docs/koncept.md §4.5).
import { Api, ApiError } from "../api.ts";
import { cleanName, NAME_HELP } from "../names.ts";
import { clear, h } from "./dom.ts";

export interface PickerOptions {
  api: Api;
  onPick: (name: string) => void;
}

export function showPicker(root: HTMLElement, { api, onPick }: PickerOptions): void {
  const message = h("p", { role: "alert", class: "message" });
  const say = (text: string) => {
    message.textContent = text;
  };

  async function render(): Promise<void> {
    clear(root);
    say("");
    root.append(h("h1", {}, "Programmeringskurs"), h("h2", {}, "Vem är du?"));
    let names: string[];
    try {
      names = await api.listNames();
    } catch (err) {
      root.append(
        h("p", { class: "message", role: "alert" }, err instanceof ApiError ? err.message : "Något gick fel."),
        h("button", { type: "button", onclick: () => void render() }, "Försök igen"),
      );
      return;
    }

    const list = h("ul", { class: "names", "aria-label": "Namn som finns" });
    for (const name of names) {
      list.append(h("li", {}, h("button", { type: "button", class: "name", onclick: () => onPick(name) }, name)));
    }
    if (names.length > 0) root.append(list);

    const input = h("input", { id: "nytt-namn", type: "text", autocomplete: "off", maxlength: "60", "aria-describedby": "namnhjalp" });
    const form = h(
      "form",
      {
        onsubmit: (e) => {
          e.preventDefault();
          void create(input.value);
        },
      },
      h("label", { for: "nytt-namn" }, names.length > 0 ? "Är du ny? Skriv ditt namn:" : "Skriv ditt namn för att börja:"),
      input,
      h("button", { type: "submit" }, "Börja"),
      h("p", { id: "namnhjalp", class: "help" }, NAME_HELP),
    );
    root.append(form, message);
    if (names.length > 0) root.append(h("p", {}, h("button", { type: "button", class: "link", onclick: () => confirmRemove(names) }, "Ta bort ett namn")));
    input.focus();
  }

  async function create(raw: string): Promise<void> {
    const name = cleanName(raw);
    if (name === null) return say(NAME_HELP);
    try {
      onPick(await api.createName(name));
    } catch (err) {
      // The name exists already (any spelling of the capitals): just continue as that person.
      if (err instanceof ApiError && err.code === "namnet-finns") return say("Det namnet finns redan. Välj det i listan om det är du.");
      say(err instanceof ApiError ? err.message : "Något gick fel.");
    }
  }

  function confirmRemove(names: string[]): void {
    clear(root);
    const select = h("select", { id: "ta-bort-val" }, ...names.map((n) => h("option", { value: n }, n)));
    const confirm = h("input", { id: "ta-bort-text", type: "text", autocomplete: "off" });
    root.append(
      h("h1", {}, "Ta bort ett namn"),
      h("p", {}, "Allt framsteg för namnet raderas och det går inte att ångra. Du börjar om från början."),
      h("label", { for: "ta-bort-val" }, "Vilket namn?"),
      select,
      h("label", { for: "ta-bort-text" }, "Skriv namnet igen för att bekräfta:"),
      confirm,
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
              if (confirm.value.trim().toLocaleLowerCase("sv") !== select.value.toLocaleLowerCase("sv")) return say("Namnet stämmer inte, så inget har raderats.");
              void api.deleteName(select.value).then(() => render(), (err: unknown) => say(err instanceof ApiError ? err.message : "Något gick fel."));
            },
          },
          "Radera för alltid",
        ),
        " ",
        h("button", { type: "button", onclick: () => void render() }, "Avbryt"),
      ),
    );
    say("");
    select.focus();
  }

  void render();
}
