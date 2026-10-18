import { Api } from "./api.ts";
import { ProgressSync } from "./sync.ts";
import { showHome, type Home } from "./ui/home.ts";
import { showPicker } from "./ui/picker.ts";
import "./style.css";

const LAST_NAME_KEY = "kurs.namn";
const root = document.getElementById("app");
if (!root) throw new Error("#app saknas");

const api = new Api();
let sync: ProgressSync | undefined;

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
  sync = undefined;
  remember(null);
  showPicker(root as HTMLElement, { api, onPick: (name) => void start(name) });
}

async function start(name: string): Promise<void> {
  remember(name);
  let home: Home | undefined;
  const s = new ProgressSync(api, name, { onStatus: (st) => home?.setStatus(st) });
  try {
    const progress = await s.load();
    sync = s;
    home = showHome(root as HTMLElement, name, progress, choose);
    home.setStatus(s.status);
  } catch {
    // The name was removed on another device, or the server answered with an error: start over.
    choose();
  }
}

window.addEventListener("online", () => void sync?.flush());
const last = remembered();
if (last) void start(last);
else choose();
