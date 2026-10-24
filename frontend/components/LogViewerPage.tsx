import React from "react";
import { appIpcClient } from "../IpcClient";
import { type DisplayLogEntry, EMPTY_FILTERS, filterLogEntries, type LogFilters } from "../filterLogEntries";
import type { LogLevelName, ParsedLogFile } from "../../common/AppIpcDefinition";

const LEVEL_ORDER: LogLevelName[] = ["trace", "debug", "info", "warn", "error"];

function flatten(files: ParsedLogFile[]): DisplayLogEntry[] {
  return files.flatMap((file) => file.entries.map((entry) => ({ ...entry, sourceFile: file.fileName })));
}

function sortLevels(levels: Iterable<LogLevelName>): LogLevelName[] {
  const set = new Set(levels);
  return LEVEL_ORDER.filter((l) => set.has(l));
}

export function LogViewerPage(): React.ReactElement {
  const [allEntries, setAllEntries] = React.useState<DisplayLogEntry[]>([]);
  const [fileNames, setFileNames] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();
  const [filters, setFilters] = React.useState<LogFilters>(EMPTY_FILTERS);
  const [expandedIds, setExpandedIds] = React.useState<ReadonlySet<number>>(new Set());

  const availableLevels = React.useMemo(() => sortLevels(allEntries.map((e) => e.level)), [allEntries]);
  const availableCategories = React.useMemo(
    () => Array.from(new Set(allEntries.map((e) => e.category))).sort(),
    [allEntries]
  );

  const filteredEntries = React.useMemo(() => filterLogEntries(allEntries, filters), [allEntries, filters]);

  const handleLoadFile = React.useCallback(() => {
    setLoading(true);
    setError(undefined);
    appIpcClient
      .pickAndParseLogFile()
      .then((files) => {
        if (!files) return; // user cancelled
        setAllEntries(flatten(files));
        setFileNames(files.map((f) => f.fileName));
        setFilters(EMPTY_FILTERS);
        setExpandedIds(new Set());
      })
      .catch((e: unknown) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, []);

  const toggleLevel = (level: LogLevelName): void => {
    setFilters((prev) => {
      const levels = new Set(prev.levels);
      if (levels.has(level)) levels.delete(level);
      else levels.add(level);
      return { ...prev, levels };
    });
  };

  const toggleExpanded = (id: number): void => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="log-viewer">
      <div className="log-viewer__toolbar">
        <button type="button" onClick={handleLoadFile} disabled={loading}>
          {loading ? "Loading..." : "Load Log File..."}
        </button>
        {fileNames.length > 0 && (
          <span className="log-viewer__loaded-files">
            Loaded: {fileNames.join(", ")} ({allEntries.length} entries)
          </span>
        )}
      </div>

      {error && <div className="log-viewer__error">{error}</div>}

      {allEntries.length > 0 && (
        <>
          <div className="log-viewer__filters">
            <div className="log-viewer__filter-group">
              <span className="log-viewer__filter-label">Level:</span>
              {availableLevels.map((level) => (
                <label key={level} className={`log-viewer__level-chip log-viewer__level-chip--${level}`}>
                  <input
                    type="checkbox"
                    checked={filters.levels.size === 0 || filters.levels.has(level)}
                    onChange={() => toggleLevel(level)}
                  />
                  {level}
                </label>
              ))}
            </div>

            <div className="log-viewer__filter-group">
              <label>
                Category:{" "}
                <select
                  value={filters.category}
                  onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
                >
                  <option value="">All categories</option>
                  {availableCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {fileNames.length > 1 && (
              <div className="log-viewer__filter-group">
                <label>
                  File:{" "}
                  <select
                    value={filters.sourceFile}
                    onChange={(e) => setFilters((prev) => ({ ...prev, sourceFile: e.target.value }))}
                  >
                    <option value="">All files</option>
                    {fileNames.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div className="log-viewer__filter-group">
              <input
                type="text"
                placeholder="Search message, category, details..."
                value={filters.searchText}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchText: e.target.value }))}
              />
            </div>

            <button type="button" onClick={() => setFilters(EMPTY_FILTERS)}>
              Reset filters
            </button>
          </div>

          <div className="log-viewer__count">
            Showing {filteredEntries.length} of {allEntries.length} entries
          </div>

          <table className="log-viewer__table">
            <thead>
              <tr>
                <th />
                <th>Timestamp</th>
                <th>Level</th>
                <th>Category</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => {
                const isExpanded = expandedIds.has(entry.id);
                return (
                  <React.Fragment key={`${entry.sourceFile}-${entry.id}`}>
                    <tr
                      className={`log-viewer__row log-viewer__row--${entry.level}`}
                      onClick={() => entry.detail && toggleExpanded(entry.id)}
                    >
                      <td className="log-viewer__expand-cell">{entry.detail ? (isExpanded ? "\u25be" : "\u25b8") : ""}</td>
                      <td>{entry.timestamp}</td>
                      <td>
                        <span className={`log-viewer__level-badge log-viewer__level-badge--${entry.level}`}>
                          {entry.level}
                        </span>
                      </td>
                      <td>{entry.category}</td>
                      <td>{entry.message}</td>
                    </tr>
                    {isExpanded && entry.detail && (
                      <tr className="log-viewer__detail-row">
                        <td colSpan={5}>
                          <pre>{entry.detail}</pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {allEntries.length === 0 && !loading && !error && (
        <div className="log-viewer__empty">Load a .zip archive or .log file to view and filter its entries.</div>
      )}
    </div>
  );
}
