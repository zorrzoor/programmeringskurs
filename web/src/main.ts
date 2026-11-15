import { Api } from "./api.ts";
import { config, loadConfig } from "./config.ts";
import { glomKod, hamtaKod, sparaKod } from "./koder.ts";
import { skapaKoerare } from "./py/koerare.ts";
import { ProgressSync } from "./sync.ts";
import { loadFailure, LOST_TEXT } from "./uppstart.ts";
import { h } from "./ui/dom.ts";
import { startApp, type App } from "./ui/app.ts";
import { skapaCodeMirror } from "./ui/editor.ts";
import { showPicker } from "./ui/picker.ts";
import { lasVisning, tillampaVisning } from "./visning.ts";
import "./style.css";

const LAST_NAME_KEY = "kurs.namn";
const root = document.getElementById("app");
if (!root) throw new Error("#app saknas");

tillampaVisning(lasVisning());

const api = new Api();
const koerare = skapaKoerare();
let sync: ProgressSync | undefined;
let app: App | undefined;

const remember = (name: string | null) => {
  try {
    if (name === null) localStorage.removeItem(LAST_NAME_KEY);
    else localStorage.setItem(LAST_NAME_KEY, name);
  } catch {
    // the device does not remember the name; the picker is shown each time
  }
};
const remembered = () => {
  try {
    return localStorage.getItem(LAST_NAME_KEY);
  } catch {
    return null;
  }
};

function choose(notice?: string): void {
  sync?.stop();
  app?.stang();
  sync = undefined;
  app = undefined;
  remember(null);
  api.setCode(null);
  history.replaceState(null, "", location.pathname);
  showPicker(root as HTMLElement, {
    api,
    notice,
    onPick: (name, code) => {
      if (code !== undefined) sparaKod(name, code);
      void start(name);
    },
  });
}

async function start(name: string): Promise<void> {
  remember(name);
  // The public instance: this device's code for the name (the picker saved it). Without it the server refuses and we start over.
  api.setCode(config().lage === "publik" ? hamtaKod(name) : null);
  const s = new ProgressSync(api, name, {
    onStatus: (st) => app?.setStatus(st),
    onNameLost: (err) => {
      if (config().lage === "publik" && err.code === "fel-kod") glomKod(name);
      choose(LOST_TEXT[err.code] ?? LOST_TEXT["okant-namn"]);
    },
  });
  try {
    await s.load();
    sync = s;
    void koerare.start().catch(() => {}); // load Python in the background while the learner reads
    app = startApp(root as HTMLElement, name, s, { koerare, editor: skapaCodeMirror }, () => choose());
    app.setStatus(s.status);
  } catch (err) {
    const what = loadFailure(err, config().lage);
    if (what.visa === "forsok-igen") return unavailable(() => void start(name));
    if (what.glomKod) glomKod(name);
    choose(what.notice);
  }
}

/** The server does not answer (restarting, #190): nothing is forgotten, and the learner can try again. */
function unavailable(retry: () => void): void {
  (root as HTMLElement).replaceChildren(
    h(
      "main",
      { id: "innehall", class: "sida" },
      h("h1", {}, "Programmeringskurs"),
      h("p", { class: "message", role: "alert" }, "Servern svarar inte just nu. Ditt namn, din kod och det du har gjort finns kvar."),
      h("button", { type: "button", onclick: retry }, "Försök igen"),
    ),
  );
}

window.addEventListener("online", () => void sync?.flush());
// Without the server's mode the public instance would show the private picker (no code field): wait for it (#190).
async function boot(): Promise<void> {
  if (!(await loadConfig(api))) return unavailable(() => void boot());
  const last = remembered();
  if (last) void start(last);
  else choose();
}
void boot();
