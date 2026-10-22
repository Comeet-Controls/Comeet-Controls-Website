/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  // Where the E2E test files live
  testDir: "./tests/e2e",

  // Run tests in parallel
  fullyParallel: true,

  // Retry failed tests once on CI
  retries: process.env.CI ? 1 : 0,

  // Max workers (2 on CI to avoid overloading, unlimited locally)
  workers: process.env.CI ? 2 : undefined,

  // Reporter
  reporter: process.env.CI ? "github" : "list",

  use: {
    // Base URL — override with TEST_BASE_URL env var on CI
    baseURL: process.env.TEST_BASE_URL || "http://localhost:3000",

    // Capture screenshot on failure
    screenshot: "only-on-failure",

    // Capture video on failure
    video: "on-first-retry",

    // Global timeout per action
    actionTimeout: 10000,

    // Trace on failure for debugging
    trace: "on-first-retry",
  },

  // Global test timeout
  timeout: 30000,

  // Browsers to test on
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
    // Uncomment these for cross-browser testing:
    // { name: "firefox",  use: { browserName: "firefox" } },
    // { name: "webkit",   use: { browserName: "webkit" } },
  ],

  // Start the dev server automatically before tests (local only)
  webServer: process.env.CI
    ? undefined // CI starts the server separately
    : {
        command: "npm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: true, // Don't restart if already running
        timeout: 60000,
      },
};

export default config;
