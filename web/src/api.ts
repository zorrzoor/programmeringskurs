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
  /** The access code of the chosen name (public instance); sent with every call about that name. */
  private code: string | null = null;

  constructor(fetchFn: FetchFn = (input, init) => fetch(input, init)) {
    this.fetchFn = fetchFn;
  }

  setCode(code: string | null): void {
    this.code = code;
  }

  private async call<T>(method: string, path: string, body?: unknown): Promise<T> {
    let res: Response;
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["content-type"] = "application/json";
    if (this.code !== null && path.startsWith("/api/namn/")) headers["x-kod"] = this.code;
    try {
      res = await this.fetchFn(path, {
        method,
        headers: Object.keys(headers).length > 0 ? headers : undefined,
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

  getConfig(): Promise<{ lage: "privat" | "publik"; maxNamn: number }> {
    return this.call("GET", "/api/config");
  }

  /** The private instance lists every name; the public one searches (`query`) and returns a limited number of hits. */
  async listNames(query = ""): Promise<string[]> {
    return (await this.searchNames(query)).namn;
  }

  searchNames(query = ""): Promise<{ namn: string[]; totalt?: number }> {
    return this.call("GET", query === "" ? "/api/namn" : `/api/namn?q=${encodeURIComponent(query)}`);
  }

  /** Creates the name. The public instance also returns its access code (shown once). */
  createName(name: string): Promise<{ namn: string; kod?: string }> {
    return this.call("POST", "/api/namn", { namn: name });
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
