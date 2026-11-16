import { beforeEach, describe, expect, test, vi } from "vitest";
import { ProgressSync, type SaveStatus } from "../src/sync.ts";
import { ApiError } from "../src/api.ts";
import { FakeApi, MemoryStorage } from "./helpers.ts";

let api: FakeApi;
let storage: MemoryStorage;
let clock: number;
let statuses: SaveStatus[];

let lost: ApiError[];
const make = (name = "Fia") =>
  new ProgressSync(api, name, {
    delayMs: 100,
    retryMs: 1000,
    now: () => ++clock,
    storage,
    onStatus: (s) => statuses.push(s),
    onNameLost: (e) => lost.push(e),
  });

beforeEach(() => {
  vi.useFakeTimers();
  api = new FakeApi(["Fia"]);
  storage = new MemoryStorage();
  clock = 1000;
  statuses = [];
  lost = [];
});

describe("ProgressSync", () => {
  test("loads the saved progress", async () => {
    api.people.get("fia")!.ovningar.o1 = { kod: "x = 1", klar: true, tid: 5 };
    const s = make();
    expect((await s.load()).ovningar.o1).toEqual({ kod: "x = 1", klar: true, tid: 5 });
  });

  test("a change is sent after the delay and the status follows", async () => {
    const s = make();
    await s.load();
    s.save("o1", { kod: "print(1)" });
    expect(s.exercise("o1")?.kod).toBe("print(1)"); // visible at once
    expect(api.people.get("fia")!.ovningar.o1).toBeUndefined();
    await vi.advanceTimersByTimeAsync(150);
    expect(api.people.get("fia")!.ovningar.o1?.kod).toBe("print(1)");
    expect(statuses).toEqual(["sparas", "sparat"]);
    expect(storage.data.size).toBe(0); // nothing left queued
  });

  test("many quick changes are sent as one", async () => {
    const s = make();
    await s.load();
    for (const kod of ["a", "ab", "abc"]) s.save("o1", { kod });
    await vi.advanceTimersByTimeAsync(150);
    expect(api.calls.filter((c) => c.startsWith("saveExercise"))).toHaveLength(1);
    expect(api.people.get("fia")!.ovningar.o1?.kod).toBe("abc");
  });

  test("without a network the change is kept (also in the browser) and sent when the server is back", async () => {
    const s = make();
    await s.load();
    api.offline = true;
    s.save("o1", { kod: "x", klar: true });
    await vi.advanceTimersByTimeAsync(150);
    expect(s.status).toBe("offline");
    expect(storage.data.size).toBe(1);
    api.offline = false;
    await vi.advanceTimersByTimeAsync(1100);
    expect(api.people.get("fia")!.ovningar.o1).toMatchObject({ kod: "x", klar: true });
    expect(s.status).toBe("sparat");
    expect(storage.data.size).toBe(0);
  });

  test("a queue left in the browser is sent after a reload, even when the server is out of reach at first", async () => {
    let s = make();
    await s.load();
    api.offline = true;
    s.save("o2", { kod: "kvar" });
    s.setLastLesson("m1.l2");
    s.stop();
    // reload while still offline: the queued work is shown and kept
    s = make();
    const progress = await s.load();
    expect(progress.ovningar.o2?.kod).toBe("kvar");
    expect(progress.senast).toBe("m1.l2");
    api.offline = false;
    await vi.advanceTimersByTimeAsync(1100);
    expect(api.people.get("fia")!.ovningar.o2?.kod).toBe("kvar");
    expect(api.people.get("fia")!.senast).toBe("m1.l2");
  });

  test("done is never taken back by a later save", async () => {
    const s = make();
    await s.load();
    s.save("o1", { kod: "a", klar: true });
    await s.flush();
    s.save("o1", { kod: "b", klar: false });
    await s.flush();
    expect(s.exercise("o1")).toMatchObject({ kod: "b", klar: true });
  });

  test("a name that was removed elsewhere is reported by load", async () => {
    api.people.clear();
    await expect(make().load()).rejects.toMatchObject({ status: 404 });
  });

  test("a server error keeps the queue and tries again later", async () => {
    const s = make();
    await s.load();
    const original = api.saveExercise.bind(api);
    let fail = true;
    api.saveExercise = async (...args) => {
      if (fail) throw new (await import("../src/api.ts")).ApiError(500, "internt", "fel");
      return original(...args);
    };
    s.save("o1", { kod: "x" });
    await vi.advanceTimersByTimeAsync(150);
    expect(s.status).toBe("fel");
    fail = false;
    await vi.advanceTimersByTimeAsync(1100);
    expect(s.status).toBe("sparat");
    expect(api.people.get("fia")!.ovningar.o1?.kod).toBe("x");
  });

  describe("errors that never pass (#194)", () => {
    const refuse = (ids: string[], err: ApiError) => {
      const original = api.saveExercise.bind(api);
      api.saveExercise = async (name, id, body) => {
        if (ids.includes(id)) {
          api.calls.push(`saveExercise ${id}`);
          throw err;
        }
        return original(name, id, body);
      };
    };

    test("an exercise the server refuses (422) is skipped, the rest is saved, and the learner is told why", async () => {
      const s = make();
      await s.load();
      refuse(["o1"], new ApiError(422, "ogiltig-kod", "Koden är för lång (högst 20 kB)."));
      s.save("o1", { kod: "x".repeat(30_000) });
      s.save("o2", { kod: "print(2)" });
      await vi.advanceTimersByTimeAsync(150);
      expect(api.people.get("fia")!.ovningar.o2?.kod).toBe("print(2)");
      expect(s.status).toBe("avvisad");
      expect(s.refused).toBe("Koden är för lång (högst 20 kB).");
      expect(storage.data.size).toBe(0); // nothing left that would be sent for ever
      const calls = api.calls.length;
      await vi.advanceTimersByTimeAsync(60_000);
      expect(api.calls.length).toBe(calls); // no retries
    });

    test("a temporary error (503) is sent again later", async () => {
      const s = make();
      await s.load();
      refuse(["o1"], new ApiError(503, "okant", "Något gick fel."));
      s.save("o1", { kod: "a" });
      await vi.advanceTimersByTimeAsync(150);
      expect(s.status).toBe("fel");
      expect(storage.data.size).toBe(1);
      refuse([], new ApiError(503, "okant", ""));
      api.saveExercise = FakeApi.prototype.saveExercise.bind(api);
      await vi.advanceTimersByTimeAsync(1100);
      expect(api.people.get("fia")!.ovningar.o1?.kod).toBe("a");
      expect(s.status).toBe("sparat");
    });

    test("a name that is gone (404) stops the retries, keeps the queue and reports it once", async () => {
      const s = make();
      await s.load();
      api.people.delete("fia");
      s.save("o1", { kod: "kvar" });
      await vi.advanceTimersByTimeAsync(150);
      expect(s.status).toBe("namn-borta");
      expect(lost.map((e) => e.code)).toEqual(["okant-namn"]);
      expect(storage.data.size).toBe(1); // what was written is still in the browser
      const calls = api.calls.length;
      s.save("o2", { kod: "mer" });
      await vi.advanceTimersByTimeAsync(60_000);
      expect(api.calls.length).toBe(calls);
      expect(lost).toHaveLength(1);
    });

    test("a code that no longer fits (403) is a lost name too", async () => {
      const s = make();
      await s.load();
      refuse(["o1"], new ApiError(403, "fel-kod", "Koden stämmer inte."));
      s.save("o1", { kod: "a" });
      await vi.advanceTimersByTimeAsync(150);
      expect(s.status).toBe("namn-borta");
      expect(lost.map((e) => e.code)).toEqual(["fel-kod"]);
    });
  });
});
