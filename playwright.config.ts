import { defineConfig, devices } from "@playwright/test";

/**
 * Runs against a production build, not `next dev` — the entrance is timing
 * sensitive and dev-mode compilation makes readiness signals meaningless.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:3000",
    ...devices["Desktop Chrome"],
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
