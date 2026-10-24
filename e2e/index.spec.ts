/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { ITwinStudioExe, StudioPage } from "@bentley/studio-apps-testing";
import { test } from "@playwright/test";
import path from "path";
import { TestEnvironment } from "./TestEnvironment";

function requireEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Required environment variable "${name}" is not set. Please set it before running E2E tests.`);
  }

  return value;
}

const ITWIN_NAME = requireEnvVar("ITWIN_NAME");

test.describe("App can be loaded", () => {
  let app!: ITwinStudioExe;
  let studioPage: StudioPage;

  test.beforeAll(async () => {
    app = await ITwinStudioExe.create({
      executablePath: process.env.ExecutablePath,
      appConfig: {
        path: path.join(__dirname, "../app.config.json"),
      },
      loadLocalApps: [
        {
          path: path.join(__dirname, ".."), // path to the directory containing the app you want to test's package.json file
        },
      ],
      // sign-in credentials for a test user account to automate sign in
      authConfig: TestEnvironment.authConfig,
    });
    studioPage = new StudioPage(app.window);
  });

  test.afterAll(async () => {
    await app?.destroy();
  });

  test("can select an iTwin", async () => {
    await studioPage.selectITwin({ name: ITWIN_NAME });
  });
});
