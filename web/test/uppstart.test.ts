import { describe, expect, test } from "vitest";
import { ApiError } from "../src/api.ts";
import { loadFailure, LOST_TEXT } from "../src/uppstart.ts";

describe("start of a name (#190): only a definite answer forgets the code", () => {
  test("a server that is restarting (5xx), a rate limit or no network keeps everything and offers to try again", () => {
    for (const err of [new ApiError(503, "okant", ""), new ApiError(502, "okant", ""), new ApiError(429, "for-manga", ""), new ApiError(0, "nat", ""), new Error("x")]) {
      expect(loadFailure(err, "publik")).toEqual({ visa: "forsok-igen" });
    }
  });

  test("a wrong code (403) forgets the code in the public instance and says why", () => {
    expect(loadFailure(new ApiError(403, "fel-kod", ""), "publik")).toEqual({ visa: "namnval", glomKod: true, notice: LOST_TEXT["fel-kod"] });
  });

  test("a name that is gone (404) forgets the code in the public instance, never in the private one", () => {
    expect(loadFailure(new ApiError(404, "okant-namn", ""), "publik")).toMatchObject({ visa: "namnval", glomKod: true });
    expect(loadFailure(new ApiError(404, "okant-namn", ""), "privat")).toMatchObject({ visa: "namnval", glomKod: false });
  });

  test("another refusal goes back to the picker and keeps the code", () => {
    expect(loadFailure(new ApiError(422, "ogiltigt-namn", ""), "publik")).toEqual({ visa: "namnval", glomKod: false });
  });
});
