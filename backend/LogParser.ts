import type { LogEntry, LogLevelName } from "../common/AppIpcDefinition";

// Matches lines like:
// 2026-10-24 12:12:58.467 [info] |iTwinStudio.Root| Starting new session
const LOG_LINE_PATTERN =
  /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}) \[(trace|debug|info|warn|error)\] \|([^|]+)\| ?(.*)$/;

/**
 * Parses the text of a single iTwin Studio log file into structured entries.
 * Each entry starts with a line matching {@link LOG_LINE_PATTERN}. Any subsequent lines
 * that don't start a new entry (pretty-printed JSON payloads, stack traces) are collected as
 * that entry's `detail`.
 */
export function parseLogText(text: string): LogEntry[] {
  const lines = text.split(/\r?\n/);
  const entries: LogEntry[] = [];
  let current: LogEntry | undefined;
  let detailLines: string[] = [];
  let nextId = 1;

  const flush = (): void => {
    if (!current) return;
    const detail = detailLines.join("\n").trim();
    if (detail.length > 0) current.detail = detail;
    entries.push(current);
    current = undefined;
    detailLines = [];
  };

  for (const line of lines) {
    const match = LOG_LINE_PATTERN.exec(line);
    if (match) {
      flush();
      const [, timestamp, level, category, message] = match;
      current = {
        id: nextId++,
        timestamp,
        level: level as LogLevelName,
        category: category.trim(),
        message: message.trim(),
      };
    } else if (current) {
      if (detailLines.length === 0 && line.trim().length === 0) continue;
      detailLines.push(line);
    }
  }
  flush();

  return entries;
}
