// The output panel under an editor: the program's output as it comes, an input box while the program waits for
// input(), and errors explained in Swedish (with Python's own text kept below, to be recognised later).
import { forklaraFel, type PyFel } from "../py/felmeddelanden.ts";
import { h } from "./dom.ts";

export interface Utdata {
  rot: HTMLElement;
  rensa(): void;
  skriv(text: string): void;
  visaFel(fel: PyFel, kod: string): void;
  /** An input box; resolves with the answer (and shows it in the output like a terminal would). */
  fraga(): Promise<string>;
  /** A short message below the output (status, feedback). */
  meddela(text: string, art?: "ok" | "info" | "fel"): void;
}

export function skapaUtdata(): Utdata {
  const pre = h("pre", { class: "utdata", "aria-label": "Resultat" }, "");
  const meddelande = h("div", { class: "meddelande", role: "status" });
  const rot = h("div", { class: "utdata-yta" }, pre, meddelande);
  return {
    rot,
    rensa() {
      pre.textContent = "";
      meddelande.textContent = "";
      meddelande.className = "meddelande";
      rot.querySelectorAll(".fel-ruta, .svarsrad").forEach((e) => e.remove());
    },
    skriv(text) {
      pre.append(document.createTextNode(text));
    },
    visaFel(fel, kod) {
      const f = forklaraFel(fel);
      const rad = fel.rad ? kod.split("\n")[fel.rad - 1] : undefined;
      rot.append(
        h(
          "div",
          { class: "fel-ruta", role: "alert" },
          h("p", { class: "fel-rubrik" }, "Programmet stoppades. Det är helt normalt, och felet berättar vad du ska titta på."),
          h("h4", {}, f.rubrik),
          fel.rad ? h("p", {}, `Rad ${fel.rad}${rad !== undefined ? ": " : ""}`, rad !== undefined ? h("code", {}, rad.trim() || "(tom rad)") : null) : null,
          h("p", {}, f.forklaring),
          f.tips ? h("p", { class: "tips" }, f.tips) : null,
          h("p", { class: "pythons-text" }, "Pythons egen text: ", h("code", {}, `${fel.typ}${fel.meddelande ? `: ${fel.meddelande}` : ""}`)),
        ),
      );
    },
    fraga() {
      return new Promise((resolve) => {
        const falt = h("input", { type: "text", id: `svar-${Math.random().toString(36).slice(2)}`, autocomplete: "off" });
        const skicka = () => {
          const v = (falt as HTMLInputElement).value;
          rad.remove();
          pre.append(document.createTextNode(`${v}\n`));
          resolve(v);
        };
        const rad = h(
          "div",
          { class: "svarsrad" },
          h("label", { for: falt.id }, "Programmet väntar på ett svar:"),
          falt,
          h("button", { type: "button", onclick: skicka }, "Skicka"),
        );
        falt.addEventListener("keydown", (e) => {
          if ((e as KeyboardEvent).key === "Enter") skicka();
        });
        rot.append(rad);
        (falt as HTMLInputElement).focus();
      });
    },
    meddela(text, art = "info") {
      meddelande.textContent = text;
      meddelande.className = `meddelande ${art}`;
    },
  };
}
