import { IpcApp } from "@itwin/core-frontend";
import { StudioStartupApp } from "@bentley/studio-startup-apps-frontend-api";
import { APP_IPC_CHANNEL_NAME, type AppIpcInterface } from "../common/AppIpcDefinition";

/**
 * Reusable {@link Proxy} object that is used to invoke {@link AppIpcInterface} methods on the backend.
 */
export const appIpcClient = IpcApp.makeIpcProxy<AppIpcInterface>(StudioStartupApp.appChannel(APP_IPC_CHANNEL_NAME));
