import { IpcHandler } from "@itwin/core-backend";
import { StudioStartupHost } from "@bentley/studio-startup-apps-backend-api";
import { APP_IPC_CHANNEL_NAME, type AppIpcInterface, type ParsedLogFile } from "../common/AppIpcDefinition";
import { parseLogSource } from "./LogSource";

export class IpcHandlers extends IpcHandler implements AppIpcInterface {
  public override get channelName(): string {
    return StudioStartupHost.appChannel(APP_IPC_CHANNEL_NAME);
  }

  public async pickAndParseLogFile(): Promise<ParsedLogFile[] | undefined> {
    const result = await StudioStartupHost.showOpenDialog({
      title: "Select a log archive or log file",
      properties: ["openFile"],
      filters: [
        { name: "Log archives and files", extensions: ["zip", "log", "txt"] },
        { name: "Zip archives", extensions: ["zip"] },
        { name: "Log files", extensions: ["log", "txt"] },
        { name: "All files", extensions: ["*"] },
      ],
    });

    if (result.canceled || result.filePaths.length === 0) return undefined;
    return parseLogSource(result.filePaths[0]);
  }
}
