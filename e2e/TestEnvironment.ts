/*---------------------------------------------------------------------------------------------
 * Copyright (c) Bentley Systems, Incorporated. All rights reserved.
 * See LICENSE.md in the project root for license terms and full copyright notice.
 *--------------------------------------------------------------------------------------------*/

import path from "path";
import * as dotenv from "dotenv";
import assert from "assert";
import fse from "fs-extra";
import type { SignInCredentials } from "@bentley/studio-apps-testing/signin-utils";

const studioQaEnvFile = path.join(__dirname, "./.env.development");
const studioProdEnvFile = path.join(__dirname, "./.env.production");

/**
 * Get and set environment variables for the test environment
 * To use the QA environment, call `TestEnvironment.useQaEnv()`
 * To use the production environment, call `TestEnvironment.useProdEnv()`
 */
export class TestEnvironment {
  public static useProdEnv() {
    assert(fse.existsSync(studioProdEnvFile), `${studioProdEnvFile} does not exist`);
    dotenv.config({ path: studioProdEnvFile, override: false });
    const localProdEnvFile = `${studioProdEnvFile}.local`;
    if (!process.env.STUDIO_TEST_USER_PASSWORD_PROD) {
      assert(
        fse.existsSync(localProdEnvFile),
        `${localProdEnvFile} does not exist, please create it to run tests locally in production environment`
      );
    }
    dotenv.config({ path: localProdEnvFile, override: true });
  }

  public static useQaEnv() {
    assert(fse.existsSync(studioQaEnvFile), `${studioQaEnvFile} does not exist`);
    dotenv.config({ path: studioQaEnvFile, override: false });
    const localQaEnvFile = `${studioQaEnvFile}.local`;
    if (!process.env.STUDIO_TEST_USER_EMAIL) {
      assert(
        fse.existsSync(localQaEnvFile),
        `${localQaEnvFile} does not exist, please create it to run tests locally in QA environment`
      );
    }
    dotenv.config({ path: localQaEnvFile, override: true });
  }

  /**
   * Get the auth configuration for the test environment
   */
  public static get qaAuthConfig() {
    assert(process.env.STUDIO_AUTHORITY, "STUDIO_AUTHORITY was not in the environment");
    assert(process.env.STUDIO_TEST_USER_EMAIL, "STUDIO_TEST_USER_EMAIL was not in the environment");
    assert(process.env.STUDIO_TEST_USER_PASSWORD, "STUDIO_TEST_USER_PASSWORD was not in the environment");

    const signInCredentials: SignInCredentials = {
      email: process.env.STUDIO_TEST_USER_EMAIL ?? "",
      password: process.env.STUDIO_TEST_USER_PASSWORD ?? "",
    };

    return {
      issuer: process.env.STUDIO_AUTHORITY,
      signInCredentials,
    };
  }

  public static get prodAuthConfig() {
    assert(process.env.STUDIO_AUTHORITY, "STUDIO_AUTHORITY was not in the environment");
    assert(process.env.STUDIO_TEST_USER_EMAIL_PROD, "STUDIO_TEST_USER_EMAIL_PROD was not in the environment");
    assert(process.env.STUDIO_TEST_USER_PASSWORD_PROD, "STUDIO_TEST_USER_PASSWORD_PROD was not in the environment");

    const signInCredentials: SignInCredentials = {
      email: process.env.STUDIO_TEST_USER_EMAIL_PROD ?? "",
      password: process.env.STUDIO_TEST_USER_PASSWORD_PROD ?? "",
    };

    return {
      issuer: process.env.STUDIO_AUTHORITY,
      signInCredentials,
    };
  }
  public static get authConfig() {
    if (process.env.TF_BUILD) {
      return this.prodAuthConfig;
    } else {
      return this.qaAuthConfig;
    }
  }
}
