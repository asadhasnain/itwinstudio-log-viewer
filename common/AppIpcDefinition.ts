import { APP_NAMESPACE } from "./Constants";

export const APP_IPC_CHANNEL_NAME = `${APP_NAMESPACE}-ipc-channel`;

export type LogLevelName = "trace" | "debug" | "info" | "warn" | "error";

export interface LogEntry {
  /** Unique id within the parsed file, used as a React key and for expand/collapse state. */
  id: number;
  /** Raw timestamp text as it appears in the log, e.g. "2026-10-24 12:12:58.467". */
  timestamp: string;
  level: LogLevelName;
  category: string;
  message: string;
  /** Extra lines following the log line (pretty-printed JSON payload and/or stack trace), if any. */
  detail?: string;
}

export interface ParsedLogFile {
  /** Name of the log file, e.g. the entry name inside the zip, or the file name on disk. */
  fileName: string;
  entries: LogEntry[];
}

export interface AppIpcInterface {
  /**
   * Shows a native "open file" dialog filtered to .zip/.log/.txt files, reads and parses the
   * selected file, and returns the parsed log files.
   * @returns the parsed log file(s), or `undefined` if the user cancelled the dialog.
   * @throws if the selected file could not be read or parsed (e.g. a zip with no .log entries).
   */
  pickAndParseLogFile(): Promise<ParsedLogFile[] | undefined>;
}
