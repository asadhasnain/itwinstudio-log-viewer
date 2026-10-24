import * as fs from "node:fs";
import * as path from "node:path";
import AdmZip from "adm-zip";
import type { ParsedLogFile } from "../common/AppIpcDefinition";
import { parseLogText } from "./LogParser";

const LOG_FILE_EXTENSION_PATTERN = /\.log$/i;

/**
 * Reads and parses log file(s) from the given path. Supports a .zip archive containing one or
 * more .log files, or a single plain-text .log/.txt file.
 * @throws if a .zip archive is given but contains no .log entries, or the file cannot be read.
 */
export function parseLogSource(filePath: string): ParsedLogFile[] {
  const extension = path.extname(filePath).toLowerCase();

  if (extension === ".zip") {
    const zip = new AdmZip(filePath);
    const results: ParsedLogFile[] = [];
    for (const entry of zip.getEntries()) {
      if (entry.isDirectory || !LOG_FILE_EXTENSION_PATTERN.test(entry.entryName)) continue;
      const entryText = entry.getData().toString("utf8");
      results.push({ fileName: entry.entryName, entries: parseLogText(entryText) });
    }
    if (results.length === 0) {
      throw new Error("The selected zip archive does not contain any .log files.");
    }
    return results;
  }

  const text = fs.readFileSync(filePath, "utf8");
  return [{ fileName: path.basename(filePath), entries: parseLogText(text) }];
}
