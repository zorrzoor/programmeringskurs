// "I'm stuck": a checklist, written as Markdown in content/fastnat.md.
import { kurs } from "../kurs.ts";
import { renderaMarkdown } from "../markdown.ts";
import { h } from "./dom.ts";

export function visaFastnat(rot: HTMLElement): void {
  const text = h("div", { class: "text" });
  text.append(renderaMarkdown(kurs.fastnat));
  rot.replaceChildren(h("h1", { tabindex: "-1", id: "sidtitel" }, "Jag har fastnat"), text, h("p", {}, h("button", { type: "button", class: "sekundar", onclick: () => history.back() }, "← Tillbaka")));
}
