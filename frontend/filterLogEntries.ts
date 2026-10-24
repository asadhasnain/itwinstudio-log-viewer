import type { LogEntry, LogLevelName } from "../common/AppIpcDefinition";

/** A log entry tagged with the file it was parsed from, used for display and filtering. */
export interface DisplayLogEntry extends LogEntry {
  sourceFile: string;
}

export interface LogFilters {
  /** Levels to include. An empty set means "no filtering by level" (show all levels). */
  levels: ReadonlySet<LogLevelName>;
  /** Category to restrict to, or "" for all categories. */
  category: string;
  /** Source file to restrict to, or "" for all files. */
  sourceFile: string;
  /** Case-insensitive substring search over category, message and detail. */
  searchText: string;
}

export const EMPTY_FILTERS: LogFilters = {
  levels: new Set(),
  category: "",
  sourceFile: "",
  searchText: "",
};

/** Returns the entries matching all active filters. */
export function filterLogEntries(entries: readonly DisplayLogEntry[], filters: LogFilters): DisplayLogEntry[] {
  const search = filters.searchText.trim().toLowerCase();

  return entries.filter((entry) => {
    if (filters.levels.size > 0 && !filters.levels.has(entry.level)) return false;
    if (filters.category && entry.category !== filters.category) return false;
    if (filters.sourceFile && entry.sourceFile !== filters.sourceFile) return false;
    if (search) {
      const haystack = `${entry.category} ${entry.message} ${entry.detail ?? ""}`.toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });
}
