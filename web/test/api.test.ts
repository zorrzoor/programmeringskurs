import { describe, expect, test } from "vitest";
import { Api, ApiError } from "../src/api.ts";

const reply = (status: number, body?: unknown) => () => Promise.resolve(new Response(body === undefined ? null : JSON.stringify(body), { status }));

describe("Api", () => {
  test("lists names and encodes names in the path", async () => {
    const seen: string[] = [];
    const api = new Api((url, init) => {
      seen.push(`${init?.method} ${url}`);
      return Promise.resolve(new Response(JSON.stringify({ namn: ["Åsa Lena"], senast: null, ovningar: {} })));
    });
    expect(await api.listNames()).toEqual(["Åsa Lena"]);
    await api.getProgress("Åsa Lena/x");
    expect(seen).toEqual(["GET /api/namn", "GET /api/namn/%C3%85sa%20Lena%2Fx/framsteg"]);
  });

  test("sends JSON bodies", async () => {
    let body = "";
    const api = new Api((_url, init) => {
      body = String(init?.body);
      return Promise.resolve(new Response(JSON.stringify({ kod: "x", klar: true, tid: 1 })));
    });
    await api.saveExercise("Fia", "o1", { kod: "x", klar: true, tid: 1 });
    expect(JSON.parse(body)).toEqual({ kod: "x", klar: true, tid: 1 });
  });

  test("204 gives no body", async () => {
    await expect(new Api(reply(204)).deleteName("Fia")).resolves.toBeUndefined();
  });

  test("error answers keep the server's code and message", async () => {
    const api = new Api(reply(409, { fel: "namnet-finns", meddelande: "Namnet finns redan." }));
    await expect(api.createName("Fia")).rejects.toMatchObject({ status: 409, code: "namnet-finns", message: "Namnet finns redan." });
  });

  test("an unreadable error answer still gives an error", async () => {
    const api = new Api(() => Promise.resolve(new Response("<html>", { status: 502 })));
    await expect(api.listNames()).rejects.toMatchObject({ status: 502, code: "okant" });
  });

  test("no network is status 0 and offline", async () => {
    const api = new Api(() => Promise.reject(new TypeError("Failed to fetch")));
    const err = await api.listNames().catch((e: unknown) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).offline).toBe(true);
  });
});
