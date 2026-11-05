// The step-by-step view (docs/koncept.md §4.3): the same code, one row at a time, with the variables as they are now and
// the output so far. The row about to run is marked with an arrow and a background (never colour alone), a variable that
// just changed is marked "ändrades", and the current step is announced for screen readers.
import type { StegResultat } from "../py/engine.ts";
import { forklaraFel } from "../py/felmeddelanden.ts";
import { h, kodtext } from "./dom.ts";

export interface Stegvisare {
  rot: HTMLElement;
  /** Go to step i (0-based). */
  till(i: number): void;
  stoppa(): void;
}

export function skapaStegvisare(kod: string, res: StegResultat, onStang: () => void): Stegvisare {
  const rader = kod.split("\n");
  const steg = res.steg;
  let i = 0;
  let timer: ReturnType<typeof setInterval> | undefined;

  const kodYta = h("ol", { class: "stegkod", "aria-label": "Koden" });
  const radEl = rader.map((r, k) => {
    const li = h("li", { value: String(k + 1) }, h("span", { class: "pil", "aria-hidden": "true" }, ""), h("code", {}, r || " "));
    kodYta.append(li);
    return li;
  });
  const variabler = h("table", { class: "variabler" }, h("caption", {}, "Variabler just nu"));
  const utdata = h("pre", { class: "utdata", "aria-label": "Resultat hittills" }, "");
  const status = h("p", { class: "stegstatus", role: "status", "aria-live": "polite" });
  const slut = h("div", { class: "stegslut" });

  const knapp = (text: string, onclick: () => void) => h("button", { type: "button", class: "sekundar", onclick }, text);
  const bakat = knapp("◀ Förra", () => {
    stoppa();
    till(i - 1);
  });
  const framat = h("button", { type: "button", onclick: () => (stoppa(), till(i + 1)) }, "Nästa ▶");
  const spela = knapp("▶ Spela", () => {
    if (timer) return stoppa();
    spela.textContent = "❚❚ Pausa";
    if (i >= steg.length - 1) till(0);
    timer = setInterval(() => {
      if (i >= steg.length - 1) return stoppa();
      till(i + 1);
    }, 900);
  });
  const borja = knapp("⏮ Början", () => (stoppa(), till(0)));
  const stang = knapp("✕ Stäng", () => (stoppa(), onStang()));

  function stoppa(): void {
    if (timer) clearInterval(timer);
    timer = undefined;
    spela.textContent = "▶ Spela";
  }

  function till(n: number): void {
    i = Math.min(Math.max(n, 0), steg.length - 1);
    const s = steg[i];
    if (!s) return;
    const foreg = i > 0 ? steg[i - 1] : undefined;
    radEl.forEach((li, k) => {
      const nu = s.rad === k + 1;
      li.classList.toggle("nu", nu);
      (li.querySelector(".pil") as HTMLElement).textContent = nu ? "➜" : "";
      if (nu) li.setAttribute("aria-current", "step");
      else li.removeAttribute("aria-current");
    });
    const gamla = new Map(foreg?.variabler ?? []);
    variabler.replaceChildren(variabler.firstElementChild as Node);
    if (s.variabler.length === 0) variabler.append(h("tr", {}, h("td", { colspan: "3", class: "hjalp" }, "Inga variabler än.")));
    for (const [namn, varde] of s.variabler) {
      const andrad = gamla.get(namn) !== varde;
      variabler.append(h("tr", { class: andrad && foreg ? "andrad" : "" }, h("th", { scope: "row" }, namn), h("td", {}, h("code", {}, varde)), h("td", { class: "andringsmarke" }, andrad && foreg ? "← ändrades" : "")));
    }
    utdata.textContent = s.utdata;
    const sista = i === steg.length - 1;
    status.textContent =
      s.rad === null
        ? `Steg ${i + 1} av ${steg.length}. Programmet är klart${res.fel ? " (det slutade med ett fel)" : ""}. Så här ser variablerna och resultatet ut på slutet.`
        : `Steg ${i + 1} av ${steg.length}. Nästa rad som körs: rad ${s.rad}${s.funktion ? ` i funktionen ${s.funktion}` : ""}: ${(rader[s.rad - 1] ?? "").trim()}`;
    (bakat as HTMLButtonElement).disabled = i === 0;
    (framat as HTMLButtonElement).disabled = sista;
    slut.replaceChildren();
    if (sista) {
      if (res.avbruten) slut.append(h("p", {}, `Programmet har fler än ${steg.length - 1} steg, så vi visar de första. Har du en loop som aldrig tar slut?`));
      if (res.fel) {
        const f = forklaraFel(res.fel);
        slut.append(h("div", { class: "fel-ruta", role: "alert" }, h("h4", {}, f.rubrik), h("p", {}, ...kodtext(f.forklaring)), f.tips ? h("p", { class: "tips" }, ...kodtext(f.tips)) : null, h("p", { class: "pythons-text" }, "Pythons egen text: ", h("code", {}, `${res.fel.typ}${res.fel.meddelande ? `: ${res.fel.meddelande}` : ""}`))));
      }
    }
  }

  const rot = h(
    "section",
    { class: "stegvisare", "aria-label": "Stegvis körning" },
    h("p", { class: "hjalp" }, "Pilen visar raden som ska köras härnäst. Variablerna visar läget just nu, före den raden."),
    h("div", { class: "knappar" }, borja, bakat, framat, spela, stang),
    status,
    h("div", { class: "stegrutnat" }, kodYta, h("div", {}, variabler, utdata)),
    slut,
  );
  till(0);
  return { rot, till, stoppa };
}
