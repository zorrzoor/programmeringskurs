// Hash routes, so that every address works without the server knowing about it: #/ is the overview and
// #/lektion/<id> a lesson.
export type Vy = { vy: "oversikt" } | { vy: "lektion"; id: string };

export function tolka(hash: string): Vy {
  const m = /^#\/lektion\/([a-z0-9][a-z0-9._-]*)$/.exec(hash);
  return m ? { vy: "lektion", id: m[1] as string } : { vy: "oversikt" };
}

export const lank = (vy: Vy): string => (vy.vy === "lektion" ? `#/lektion/${vy.id}` : "#/");
