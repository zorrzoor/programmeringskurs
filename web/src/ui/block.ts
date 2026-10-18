// The blocks of a lesson as interactive DOM: examples to run, predictions, and exercises with hints and a facit.
import type { Block, Filer } from "../kurs-typer.ts";
import { renderaMarkdown, inline } from "../markdown.ts";
import type { Kontroll, KorResultat, StegResultat } from "../py/engine.ts";
import type { KorValj } from "../py/koerare.ts";
import { normalisera } from "../py/rattning.ts";
import { h } from "./dom.ts";
import type { EditorFabrik } from "./editor.ts";
import { skapaStegvisare } from "./stegvisare.ts";
import { skapaUtdata, type Utdata } from "./utdata.ts";

export interface KoerareLike {
  start(): Promise<void>;
  kor(kod: string, v?: KorValj): Promise<KorResultat>;
  kontrollera(kod: string, ratta: Extract<Block, { typ: "ovning" }>["ratta"], v?: KorValj): Promise<Kontroll>;
  stega(kod: string, v?: KorValj): Promise<StegResultat>;
  stoppaWorker(): void;
}

export interface Kontext {
  koerare: KoerareLike;
  editor: EditorFabrik;
  sparad(id: string): { kod: string; klar: boolean } | undefined;
  spara(id: string, andring: { kod?: string; klar?: boolean }): void;
  /** Called when a task became done, so that the lesson can show that it is complete. */
  klarNu(): void;
}

/** Run / Stop buttons and the running of code into an output panel, shared by examples and exercises. */
function skapaKorning(ctx: Kontext, stdin: string[], ut: Utdata, hamtaKod: () => string, filer?: Filer) {
  let kor = false;
  const korKnapp = h("button", { type: "button" }, "▶ Kör");
  const stoppKnapp = h("button", { type: "button", class: "sekundar", hidden: true }, "■ Stoppa");
  const tillstand = (pagar: boolean) => {
    kor = pagar;
    (korKnapp as HTMLButtonElement).disabled = pagar;
    (stoppKnapp as HTMLElement).hidden = !pagar;
  };
  const valj = (): KorValj => ({ stdin, filer, onUtdata: ut.skriv, fraga: () => ut.fraga() });
  const laddar = async () => {
    ut.meddela("Python laddas (första gången tar det några sekunder) …");
    await ctx.koerare.start();
    ut.meddela("");
  };
  stoppKnapp.addEventListener("click", () => {
    ctx.koerare.stoppaWorker();
    tillstand(false);
    ut.meddela("Du stoppade programmet.");
  });
  // The step-by-step view: runs the code with tracing and shows it below the buttons.
  const stegKnapp = h("button", { type: "button", class: "sekundar" }, "⏭ Stegvis");
  const stegYta = h("div", { class: "steg-yta" });
  stegKnapp.addEventListener("click", () => {
    const yta = stegYta;
    yta.replaceChildren();
    ut.rensa();
    (stegKnapp as HTMLButtonElement).disabled = true;
    const kod = hamtaKod();
    void (async () => {
      try {
        ut.meddela("Python laddas (första gången tar det några sekunder) …");
        await ctx.koerare.start();
        ut.meddela("");
        const r = await ctx.koerare.stega(kod, valj());
        if (r.steg.length === 0 && r.fel) return ut.visaFel(r.fel, kod);
        const sv = skapaStegvisare(kod, r, () => {
          sv.stoppa();
          yta.replaceChildren();
        });
        yta.append(sv.rot);
      } catch {
        ut.meddela("Python kunde inte laddas. Ladda om sidan och försök igen.", "fel");
      } finally {
        (stegKnapp as HTMLButtonElement).disabled = false;
      }
    })();
  });
  return {
    korKnapp,
    stoppKnapp,
    stegKnapp,
    stegYta,
    pagar: () => kor,
    /** Runs `jobb` with the buttons in the running state; the output is cleared first. */
    async kor<T>(jobb: (v: KorValj) => Promise<T>): Promise<T | undefined> {
      ut.rensa();
      tillstand(true);
      let stoppad = false;
      stoppKnapp.addEventListener("click", () => (stoppad = true), { once: true });
      try {
        await laddar();
        const r = await jobb(valj());
        if (stoppad) return undefined;
        tillstand(false);
        return r;
      } catch {
        tillstand(false);
        ut.meddela("Python kunde inte laddas. Ladda om sidan och försök igen.", "fel");
        return undefined;
      }
    },
  };
}

function exempel(b: Extract<Block, { typ: "exempel" }>, ctx: Kontext): HTMLElement {
  const ut = skapaUtdata();
  const k = skapaKorning(ctx, b.stdin, ut, () => editor.get(), b.filer);
  const rot = h("section", { class: "block exempel" });
  const yta = h("div", { class: "editor-yta" });
  const editor = ctx.editor(yta, { kod: b.kod, etikett: "Exempelkod, du får ändra den" });
  k.korKnapp.addEventListener("click", () => {
    void k.kor((v) => ctx.koerare.kor(editor.get(), v)).then((r) => {
      if (r?.fel) ut.visaFel(r.fel, editor.get());
    });
  });
  const borja = h("button", { type: "button", class: "sekundar" }, "↺ Börja om");
  borja.addEventListener("click", () => {
    editor.set(b.kod);
    ut.rensa();
  });
  rot.append(h("h3", {}, "Prova"), yta, h("div", { class: "knappar" }, k.korKnapp, k.stoppKnapp, k.stegKnapp, borja), editorHjalp(), k.stegYta, ut.rot);
  return rot;
}

const editorHjalp = () => h("p", { class: "hjalp" }, "Du kan ändra koden. Tryck Esc och sedan Tab för att lämna rutan med tangentbordet.");

function forutsag(b: Extract<Block, { typ: "forutsag" }>, ctx: Kontext): HTMLElement {
  const ut = skapaUtdata();
  const rot = h("section", { class: "block forutsag" });
  const feedback = h("div", { class: "meddelande", role: "status" });
  const klarMarke = h("span", { class: "klar-marke", hidden: true }, "✓ klar");
  const forklaring = h("p", { class: "forklaring", hidden: true }, b.forklaring);
  const radios: HTMLInputElement[] = [];
  const svarsfalt = h("input", { type: "text", id: `${b.id}-svar`, autocomplete: "off" }) as HTMLInputElement;

  const fraga =
    b.alternativ.length > 0
      ? h(
          "fieldset",
          { class: "alternativ" },
          h("legend", {}, "Vad skrivs ut, eller vad händer?"),
          ...b.alternativ.map((a, i) => {
            const id = `${b.id}-a${i}`;
            const r = h("input", { type: "radio", name: b.id, id }) as HTMLInputElement;
            radios[i] = r;
            return h("div", { class: "alt" }, r, h("label", { for: id }, a));
          }),
        )
      : h("div", { class: "fritt" }, h("label", { for: svarsfalt.id }, "Vad skrivs ut? Skriv din gissning:"), svarsfalt);

  const valt = () => radios.findIndex((r) => r.checked);
  const ratt = () => (b.alternativ.length > 0 ? valt() === b.ratt : normalisera(svarsfalt.value.trim(), true).join("\n") === normalisera(b.svar.trim(), true).join("\n"));
  const markeraKlar = (spara: boolean) => {
    (klarMarke as HTMLElement).hidden = false;
    if (b.forklaring) (forklaring as HTMLElement).hidden = false;
    if (spara) {
      ctx.spara(b.id, { klar: true });
      ctx.klarNu();
    }
  };
  const svara = h("button", { type: "button" }, "Svara");
  svara.addEventListener("click", () => {
    if (b.alternativ.length > 0 && valt() < 0) return void (feedback.textContent = "Välj ett av alternativen först.");
    if (ratt()) {
      feedback.className = "meddelande ok";
      feedback.textContent = b.kor ? "Rätt! Du kan köra koden nedan och se att det stämmer." : "Rätt!";
      markeraKlar(true);
    } else {
      feedback.className = "meddelande info";
      feedback.textContent = b.kor ? "Inte riktigt. Kör koden nedan och se vad som händer, och gissa sedan igen." : "Inte riktigt. Läs igen och försök en gång till.";
    }
  });
  const k = skapaKorning(ctx, b.stdin, ut, () => b.kod, b.filer);
  k.korKnapp.textContent = "▶ Kör koden och se";
  k.korKnapp.addEventListener("click", () => {
    void k.kor((v) => ctx.koerare.kor(b.kod, v)).then((r) => {
      if (r?.fel) ut.visaFel(r.fel, b.kod);
    });
  });
  const kod = h("pre", { class: "kod" }, h("code", {}, b.kod));
  rot.append(
    h("h3", {}, "Fråga ", klarMarke),
    kod,
    fraga,
    h("div", { class: "knappar" }, svara),
    feedback,
    forklaring,
    ...(b.kor ? [h("div", { class: "knappar" }, k.korKnapp, k.stoppKnapp, k.stegKnapp), k.stegYta, ut.rot] : []),
  );
  if (ctx.sparad(b.id)?.klar) markeraKlar(false);
  return rot;
}

function ovning(b: Extract<Block, { typ: "ovning" }>, ctx: Kontext): HTMLElement {
  const ut = skapaUtdata();
  const rot = h("section", { class: "block ovning" });
  const klarMarke = h("span", { class: "klar-marke", hidden: true }, "✓ klar");
  const yta = h("div", { class: "editor-yta" });
  const sparad = ctx.sparad(b.id);
  const editor = ctx.editor(yta, { kod: sparad?.kod || b.start, etikett: `Din kod för övningen: ${b.uppgift}`, onChange: (kod) => ctx.spara(b.id, { kod }) });
  const k = skapaKorning(ctx, b.stdin, ut, () => editor.get(), b.filer);
  const markeraKlar = (spara: boolean) => {
    (klarMarke as HTMLElement).hidden = false;
    if (spara) {
      ctx.spara(b.id, { kod: editor.get(), klar: true });
      ctx.klarNu();
    }
  };

  k.korKnapp.addEventListener("click", () => {
    void k.kor((v) => ctx.koerare.kor(editor.get(), v)).then((r) => {
      if (r?.fel) ut.visaFel(r.fel, editor.get());
    });
  });

  const kontrollera = h("button", { type: "button" }, "✓ Kontrollera");
  kontrollera.addEventListener("click", () => {
    void k.kor((v) => ctx.koerare.kontrollera(editor.get(), b.ratta, v)).then((r) => {
      if (!r) return;
      if (r.fel) return ut.visaFel(r.fel, editor.get());
      if (r.ok) {
        ut.meddela("Rätt! Bra jobbat.", "ok");
        markeraKlar(true);
      } else {
        ut.meddela("Det är inte riktigt rätt än:", "info");
        ut.rot.append(h("ul", { class: "kontroll" }, ...r.meddelanden.map((m) => h("li", {}, ...inline(m)))));
        ut.rot.append(h("p", { class: "hjalp" }, "Titta på resultatet ovan, justera koden och kontrollera igen. Behöver du hjälp finns en ledtråd."));
      }
    });
  });

  // Hints in three steps: a nudge, a clearer one, almost the answer.
  const ledtradar = h("ol", { class: "ledtradar", "aria-label": "Ledtrådar" });
  let visade = 0;
  const hintKnapp = h("button", { type: "button", class: "sekundar" }, "Ledtråd (1 av 3)");
  hintKnapp.addEventListener("click", () => {
    if (visade >= 3) return;
    ledtradar.append(h("li", {}, ...inline(b.ledtradar[visade] as string)));
    visade += 1;
    hintKnapp.textContent = visade >= 3 ? "Inga fler ledtrådar" : `Ledtråd (${visade + 1} av 3)`;
    (hintKnapp as HTMLButtonElement).disabled = visade >= 3;
  });

  const borja = h("button", { type: "button", class: "sekundar" }, "↺ Börja om");
  borja.addEventListener("click", () => {
    editor.set(b.start);
    ut.rensa();
  });

  // The facit is always there but only after an active choice (two clicks).
  const facitYta = h("div", { class: "facit", hidden: true });
  const facitKnapp = h("button", { type: "button", class: "sekundar" }, "Visa facit");
  let sakert = false;
  facitKnapp.addEventListener("click", () => {
    if (!sakert) {
      sakert = true;
      facitKnapp.textContent = "Är du säker? Klicka igen för att visa facit";
      return;
    }
    (facitYta as HTMLElement).hidden = false;
    facitYta.replaceChildren(h("p", {}, "Så här kan en lösning se ut. Det finns fler rätta sätt:"), h("pre", { class: "kod" }, h("code", {}, b.facit)));
    (facitKnapp as HTMLElement).hidden = true;
  });

  rot.append(
    h("h3", {}, "Gör själv ", klarMarke),
    h("p", { class: "uppgift" }, ...inline(b.uppgift)),
    yta,
    h("div", { class: "knappar" }, k.korKnapp, k.stoppKnapp, k.stegKnapp, kontrollera, hintKnapp, borja, facitKnapp),
    editorHjalp(),
    k.stegYta,
    ledtradar,
    ut.rot,
    facitYta,
  );
  if (sparad?.klar) markeraKlar(false);
  return rot;
}

export function renderBlock(b: Block, ctx: Kontext): HTMLElement {
  switch (b.typ) {
    case "text": {
      const d = h("div", { class: "text" });
      d.append(renderaMarkdown(b.markdown));
      return d;
    }
    case "ruta": {
      const d = h("aside", { class: "ruta" }, h("h3", {}, b.rubrik));
      d.append(renderaMarkdown(b.markdown));
      return d;
    }
    case "fil":
      return h("figure", { class: "fil" }, h("figcaption", {}, `Filen ${b.namn}`), h("pre", { tabindex: "0" }, b.innehall));
    case "exempel":
      return exempel(b, ctx);
    case "forutsag":
      return forutsag(b, ctx);
    case "ovning":
      return ovning(b, ctx);
  }
}
