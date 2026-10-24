import type { PlaywrightTestConfig } from "@playwright/test";
/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  workers: 1,
  testDir: "./e2e",
  testMatch: /\.spec\.ts/,
  globalSetup: "./e2e/global.setup.ts",
  expect: {
    timeout: 60_000,
  },
};

export default config;
