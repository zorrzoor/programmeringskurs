// A small Markdown renderer for the lesson texts: paragraphs, ## headings, lists, quotes, code blocks, **bold**,
// *italic*, `code` and links. Everything is built with DOM calls and text nodes, never as HTML, so no text can inject
// markup. Links are only allowed to the course itself (#/...) and to https.
import { h } from "./ui/dom.ts";

const SAFE_LINK = /^(#\/[\w./-]*|https:\/\/[^\s"'<>]+)$/;

/** Inline formatting inside one line of text. */
export function inline(text: string): Node[] {
  const out: Node[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push(document.createTextNode(text.slice(last, m.index)));
    const tok = m[0];
    if (m[1]) out.push(h("code", {}, tok.slice(1, -1)));
    else if (m[2]) out.push(h("strong", {}, ...inline(tok.slice(2, -2))));
    else if (m[3]) out.push(h("em", {}, ...inline(tok.slice(1, -1))));
    else {
      const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok) as RegExpExecArray;
      const href = link[2] as string;
      if (SAFE_LINK.test(href)) out.push(h("a", { href }, ...inline(link[1] as string)));
      else out.push(document.createTextNode(link[1] as string)); // an unsafe link is shown as plain text
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(document.createTextNode(text.slice(last)));
  return out;
}

/** The whole text as a fragment of block elements. */
export function renderaMarkdown(markdown: string): DocumentFragment {
  const frag = document.createDocumentFragment();
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  const startsBlock = (l: string) => /^(#{1,4} |[-*] |\d+[.)] |> |```|~~~)/.test(l);
  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.trim() === "") {
      i += 1;
      continue;
    }
    const fence = /^(`{3,}|~{3,})\s*([\w-]*)\s*$/.exec(line);
    if (fence) {
      const close = new RegExp(`^\\${(fence[1] as string)[0]}{${(fence[1] as string).length},}\\s*$`);
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !close.test(lines[i] ?? "")) body.push(lines[i++] ?? "");
      i += 1;
      frag.append(h("pre", { class: "kod" }, h("code", {}, body.join("\n"))));
      continue;
    }
    const heading = /^(#{1,4}) (.*)$/.exec(line);
    if (heading) {
      const level = Math.min(Math.max((heading[1] as string).length, 2), 5) as 2 | 3 | 4 | 5; // the page title is the h1: text starts at h2
      frag.append(h(`h${level}` as "h2", {}, ...inline(heading[2] as string)));
      i += 1;
      continue;
    }
    if (/^> /.test(line)) {
      const quote: string[] = [];
      while (i < lines.length && /^> ?/.test(lines[i] ?? "")) quote.push((lines[i++] ?? "").replace(/^> ?/, ""));
      frag.append(h("blockquote", {}, ...inline(quote.join(" "))));
      continue;
    }
    const list = /^([-*]|\d+[.)]) /.exec(line);
    if (list) {
      const ordered = /\d/.test(list[1] as string);
      const items: string[] = [];
      while (i < lines.length && /^([-*]|\d+[.)]) /.test(lines[i] ?? "")) items.push((lines[i++] ?? "").replace(/^([-*]|\d+[.)]) /, ""));
      frag.append(h(ordered ? "ol" : "ul", {}, ...items.map((t) => h("li", {}, ...inline(t)))));
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && (lines[i] ?? "").trim() !== "" && (para.length === 0 || !startsBlock(lines[i] ?? ""))) para.push((lines[i++] ?? "").trim());
    frag.append(h("p", {}, ...inline(para.join(" "))));
  }
  return frag;
}
