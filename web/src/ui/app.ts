// The app after a name is chosen: a top bar (who you are, switch name, save status) and the page of the current route.
// A page change moves focus to the title, for screen readers and keyboards.
import { config } from "../config.ts";
import { hittaLektion } from "../kurs.ts";
import { tolka } from "../router.ts";
import type { ProgressSync, SaveStatus } from "../sync.ts";
import type { Kontext } from "./block.ts";
import ikonUrl from "../assets/ikon.svg";
import { h } from "./dom.ts";
import { visaFastnat } from "./fastnat.ts";
import { visaIntegritet } from "./integritet.ts";
import { visaLektion } from "./lektion.ts";
import { ordAnkare, visaOrdlista } from "./ordlista.ts";
import { visaOversikt } from "./oversikt.ts";
import { skapaVisningsval } from "./visning.ts";

const STATUS_TEXT: Record<SaveStatus, string> = {
  sparat: "Sparat",
  sparas: "Sparas …",
  offline: "Sparas när du är online igen",
  fel: "Kunde inte spara. Försöker igen strax.",
  avvisad: "En övning kunde inte sparas.",
  "namn-borta": "Det går inte att spara under det här namnet längre.",
};

export interface App {
  setStatus(status: SaveStatus): void;
  stang(): void;
}

/**
 * `onGlom` (public instance, #198): forget this name's code on the device, for a computer that others use too.
 */
export function startApp(
  rot: HTMLElement,
  namn: string,
  sync: ProgressSync,
  bas: Omit<Kontext, "sparad" | "spara" | "klarNu">,
  onByt: () => void,
  onGlom?: () => void,
): App {
  const klar = (id: string) => Boolean(sync.exercise(id)?.klar);
  const status = h("span", { class: "status", role: "status" }, STATUS_TEXT.sparat);
  const sida = h("main", { class: "sida", id: "innehall" });
  rot.replaceChildren(
    h("a", { class: "hoppa", href: "#innehall" }, "Hoppa till innehållet"),
    h("header", { class: "topp" }, h("a", { class: "logga", href: "#/" }, h("img", { class: "ikon", src: ikonUrl, alt: "", width: "32", height: "32" }), "Programmeringskurs"), h("nav", { class: "meny", "aria-label": "Hjälp" }, h("a", { href: "#/ordlista" }, "Ordlista"), h("a", { href: "#/fastnat" }, "Jag har fastnat"), ...(config().lage === "publik" ? [h("a", { href: "#/integritet" }, "Integritet")] : []), skapaVisningsval()), h("span", { class: "vem" }, `Du är ${namn} `, h("button", { type: "button", class: "link", onclick: onByt }, "Byt namn"), ...(onGlom ? [" · ", h("button", { type: "button", class: "link", onclick: onGlom }, "Glöm mig på den här enheten")] : [])), status),
    sida,
  );
  const ctx: Kontext = {
    ...bas,
    sparad: (id) => {
      const e = sync.exercise(id);
      return e ? { kod: e.kod, klar: e.klar } : undefined;
    },
    spara: (id, andring) => sync.save(id, andring),
    klarNu: () => {},
  };
  const visa = () => {
    bas.koerare.avbryt?.(); // a program waiting for input() on the old page would hold up the next run (#191)
    const vy = tolka(location.hash);
    const l = vy.vy === "lektion" ? hittaLektion(vy.id) : undefined;
    if (l) {
      sync.setLastLesson(l.id);
      visaLektion(sida, l, ctx, klar);
      document.title = `${l.titel} – Programmeringskurs`;
    } else if (vy.vy === "ordlista") {
      visaOrdlista(sida, vy.id);
      document.title = "Ordlista – Programmeringskurs";
    } else if (vy.vy === "integritet" && config().lage === "publik") {
      visaIntegritet(sida);
      document.title = "Integritet – Programmeringskurs";
    } else if (vy.vy === "fastnat") {
      visaFastnat(sida);
      document.title = "Jag har fastnat – Programmeringskurs";
    } else {
      visaOversikt(sida, namn, sync.current.senast, klar);
      document.title = "Programmeringskurs";
    }
    window.scrollTo(0, 0);
    if (vy.vy === "ordlista" && vy.id) document.getElementById(ordAnkare(vy.id))?.scrollIntoView({ block: "center" });
    document.getElementById("sidtitel")?.focus({ preventScroll: true });
  };
  window.addEventListener("hashchange", visa);
  visa();
  return {
    setStatus: (s) => {
      // A refused exercise says why (e.g. "Koden är för lång (högst 20 kB).", #194).
      status.textContent = s === "avvisad" && sync.refused ? `${STATUS_TEXT[s]} ${sync.refused}` : STATUS_TEXT[s];
    },
    stang: () => window.removeEventListener("hashchange", visa),
  };
}
