/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import { TestEnvironment } from "./TestEnvironment";

export default async function globalSetup() {
  if (process.env.TF_BUILD) {
    TestEnvironment.useProdEnv();
  } else {
    TestEnvironment.useQaEnv();
  }
}
