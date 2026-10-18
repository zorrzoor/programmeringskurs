import { Api } from "./api.ts";
import { skapaKoerare } from "./py/koerare.ts";
import { ProgressSync } from "./sync.ts";
import { startApp, type App } from "./ui/app.ts";
import { skapaCodeMirror } from "./ui/editor.ts";
import { showPicker } from "./ui/picker.ts";
import "./style.css";

const LAST_NAME_KEY = "kurs.namn";
const root = document.getElementById("app");
if (!root) throw new Error("#app saknas");

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

function choose(): void {
  sync?.stop();
  app?.stang();
  sync = undefined;
  app = undefined;
  remember(null);
  history.replaceState(null, "", location.pathname);
  showPicker(root as HTMLElement, { api, onPick: (name) => void start(name) });
}

async function start(name: string): Promise<void> {
  remember(name);
  const s = new ProgressSync(api, name, { onStatus: (st) => app?.setStatus(st) });
  try {
    await s.load();
    sync = s;
    void koerare.start().catch(() => {}); // load Python in the background while the learner reads
    app = startApp(root as HTMLElement, name, s, { koerare, editor: skapaCodeMirror }, choose);
    app.setStatus(s.status);
  } catch {
    // The name was removed on another device, or the server answered with an error: start over.
    choose();
  }
}

window.addEventListener("online", () => void sync?.flush());
const last = remembered();
if (last) void start(last);
else choose();
