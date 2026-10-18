// Client for the course server (see docs/koncept.md §9.6). The fetch function is injected for tests.
export interface Exercise {
  kod: string;
  klar: boolean;
  tid: number;
}

export interface Progress {
  namn: string;
  senast: string | null;
  ovningar: Record<string, Exercise>;
}

/** status 0 = the server could not be reached at all. */
export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }

  get offline(): boolean {
    return this.status === 0;
  }
}

type FetchFn = (input: string, init?: RequestInit) => Promise<Response>;

export class Api {
  private readonly fetchFn: FetchFn;

  constructor(fetchFn: FetchFn = (input, init) => fetch(input, init)) {
    this.fetchFn = fetchFn;
  }

  private async call<T>(method: string, path: string, body?: unknown): Promise<T> {
    let res: Response;
    try {
      res = await this.fetchFn(path, {
        method,
        headers: body === undefined ? undefined : { "content-type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
    } catch {
      throw new ApiError(0, "nat", "Det går inte att nå servern just nu.");
    }
    if (res.status === 204) return undefined as T;
    let data: { fel?: string; meddelande?: string } | undefined;
    try {
      data = (await res.json()) as typeof data;
    } catch {
      data = undefined;
    }
    if (!res.ok) throw new ApiError(res.status, data?.fel ?? "okant", data?.meddelande ?? "Något gick fel.");
    return data as T;
  }

  async listNames(): Promise<string[]> {
    return (await this.call<{ namn: string[] }>("GET", "/api/namn")).namn;
  }

  async createName(name: string): Promise<string> {
    return (await this.call<{ namn: string }>("POST", "/api/namn", { namn: name })).namn;
  }

  getProgress(name: string): Promise<Progress> {
    return this.call("GET", `/api/namn/${encodeURIComponent(name)}/framsteg`);
  }

  saveExercise(name: string, id: string, body: { kod?: string; klar?: boolean; tid: number }): Promise<Exercise> {
    return this.call("PUT", `/api/namn/${encodeURIComponent(name)}/ovningar/${encodeURIComponent(id)}`, body);
  }

  saveLastLesson(name: string, lesson: string): Promise<void> {
    return this.call("PUT", `/api/namn/${encodeURIComponent(name)}/senast`, { lektion: lesson });
  }

  deleteName(name: string): Promise<void> {
    return this.call("DELETE", `/api/namn/${encodeURIComponent(name)}`);
  }
}
