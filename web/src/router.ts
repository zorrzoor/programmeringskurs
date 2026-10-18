// Hash routes, so that every address works without the server knowing about it: #/ is the overview,
// #/lektion/<id> a lesson, #/ordlista[/<id>] the glossary (optionally scrolled to one word) and #/fastnat the page for
// when you are stuck.
export type Vy = { vy: "oversikt" } | { vy: "lektion"; id: string } | { vy: "ordlista"; id?: string } | { vy: "fastnat" };

export function tolka(hash: string): Vy {
  const lektion = /^#\/lektion\/([a-z0-9][a-z0-9._-]*)$/.exec(hash);
  if (lektion) return { vy: "lektion", id: lektion[1] as string };
  const ord = /^#\/ordlista(?:\/([a-z0-9][a-z0-9-]*))?$/.exec(hash);
  if (ord) return ord[1] ? { vy: "ordlista", id: ord[1] } : { vy: "ordlista" };
  if (hash === "#/fastnat") return { vy: "fastnat" };
  return { vy: "oversikt" };
}

export function lank(vy: Vy): string {
  if (vy.vy === "lektion") return `#/lektion/${vy.id}`;
  if (vy.vy === "ordlista") return vy.id ? `#/ordlista/${vy.id}` : "#/ordlista";
  if (vy.vy === "fastnat") return "#/fastnat";
  return "#/";
}
