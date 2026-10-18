// A tiny helper to build DOM without innerHTML (all text goes in as text, never as markup).
type Child = Node | string | null | false | undefined;

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | boolean | ((e: Event) => void)> = {},
  ...children: Child[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (typeof value === "function") el.addEventListener(key.replace(/^on/, ""), value);
    else if (value === true) el.setAttribute(key, "");
    else if (value !== false) el.setAttribute(key, value);
  }
  for (const child of children) if (child) el.append(child);
  return el;
}

export function clear(el: Element): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}
