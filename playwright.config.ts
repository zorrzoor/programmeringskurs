import { defineConfig } from "@playwright/test";

// Browser tests against the production image (scripts/browser-test.sh starts it). Chromium only.
export default defineConfig({
  testDir: "tests/browser",
  timeout: 120_000,
  expect: { timeout: 60_000 }, // the first run waits for Pyodide to load
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: process.env.E2E_URL ?? "http://127.0.0.1:18080",
    trace: "retain-on-failure",
    locale: "sv-SE",
  },
  outputDir: "test-results",
});
