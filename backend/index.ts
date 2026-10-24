import { Logger } from "@itwin/core-bentley";
import { LOG_CATEGORY } from "../common/Constants";
import { IpcHandlers } from "./IpcHandlers";

let unregisterIpcHandlers: (() => void) | undefined;

export async function activateBackend() {
  Logger.logInfo(LOG_CATEGORY, "Hello World!");
  unregisterIpcHandlers = IpcHandlers.register();
}

export async function deactivateBackend() {
  unregisterIpcHandlers?.();
  unregisterIpcHandlers = undefined;
  Logger.logInfo(LOG_CATEGORY, "Goodbye!");
}
