import { Api, ApiError } from "../src/api.ts";
import type { Exercise, Progress } from "../src/api.ts";

/** An in-memory stand-in for the server's API, with switches for "offline". */
export class FakeApi extends Api {
  people = new Map<string, Progress>();
  offline = false;
  calls: string[] = [];

  constructor(names: string[] = []) {
    super(() => Promise.reject(new Error("FakeApi does not use fetch")));
    for (const n of names) this.people.set(n.toLowerCase(), { namn: n, senast: null, ovningar: {} });
  }

  private guard(call: string): void {
    this.calls.push(call);
    if (this.offline) throw new ApiError(0, "nat", "Det går inte att nå servern just nu.");
  }

  override async listNames(): Promise<string[]> {
    this.guard("listNames");
    return [...this.people.values()].map((p) => p.namn);
  }

  override async createName(name: string): Promise<string> {
    this.guard("createName");
    if (this.people.has(name.toLowerCase())) throw new ApiError(409, "namnet-finns", "Namnet finns redan.");
    this.people.set(name.toLowerCase(), { namn: name, senast: null, ovningar: {} });
    return name;
  }

  override async getProgress(name: string): Promise<Progress> {
    this.guard("getProgress");
    const p = this.people.get(name.toLowerCase());
    if (!p) throw new ApiError(404, "okant-namn", "Det namnet finns inte.");
    return structuredClone(p);
  }

  override async saveExercise(name: string, id: string, body: { kod?: string; klar?: boolean; tid: number }): Promise<Exercise> {
    this.guard(`saveExercise ${id}`);
    const p = this.people.get(name.toLowerCase());
    if (!p) throw new ApiError(404, "okant-namn", "Det namnet finns inte.");
    const old = p.ovningar[id];
    const saved = { kod: body.kod ?? old?.kod ?? "", klar: Boolean(old?.klar) || body.klar === true, tid: body.tid };
    p.ovningar[id] = saved;
    return saved;
  }

  override async saveLastLesson(name: string, lesson: string): Promise<void> {
    this.guard("saveLastLesson");
    const p = this.people.get(name.toLowerCase());
    if (p) p.senast = lesson;
  }

  override async deleteName(name: string): Promise<void> {
    this.guard("deleteName");
    this.people.delete(name.toLowerCase());
  }
}

export class MemoryStorage {
  data = new Map<string, string>();
  getItem(k: string): string | null {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string): void {
    this.data.set(k, v);
  }
  removeItem(k: string): void {
    this.data.delete(k);
  }
}
