import { defineConfig, devices } from "@playwright/test";

const port = 4321;

// Runs against the production build served by `astro preview`.
export default defineConfig({
  testDir: "tests/e2e",
  forbidOnly: !!process.env.CI,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${port}`,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // --ignore-lock keeps the server in the foreground: Astro otherwise
    // backgrounds `astro preview` when it detects an AI agent, and
    // Playwright would treat the exited process as a failure.
    command: `npm run preview -- --port ${port} --ignore-lock`,
    port,
    reuseExistingServer: !process.env.CI,
  },
});
