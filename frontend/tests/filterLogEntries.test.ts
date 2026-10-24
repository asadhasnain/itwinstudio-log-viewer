import { type DisplayLogEntry, EMPTY_FILTERS, filterLogEntries } from "../filterLogEntries";

const entries: DisplayLogEntry[] = [
  { id: 1, timestamp: "t1", level: "info", category: "iTwinStudio.Root", message: "Starting session", sourceFile: "a.log" },
  { id: 2, timestamp: "t2", level: "warn", category: "iTwinStudio.Common", message: "LaunchDarkly default", detail: '{"key":"flag"}', sourceFile: "a.log" },
  { id: 3, timestamp: "t3", level: "error", category: "its-log-viewer", message: "Bad Request", detail: "stack trace line", sourceFile: "b.log" },
];

describe("filterLogEntries", () => {
  it("returns all entries when no filters are active", () => {
    expect(filterLogEntries(entries, EMPTY_FILTERS)).toHaveLength(3);
  });

  it("filters by level", () => {
    const result = filterLogEntries(entries, { ...EMPTY_FILTERS, levels: new Set(["error"]) });
    expect(result).toEqual([entries[2]]);
  });

  it("filters by category", () => {
    const result = filterLogEntries(entries, { ...EMPTY_FILTERS, category: "iTwinStudio.Common" });
    expect(result).toEqual([entries[1]]);
  });

  it("filters by source file", () => {
    const result = filterLogEntries(entries, { ...EMPTY_FILTERS, sourceFile: "b.log" });
    expect(result).toEqual([entries[2]]);
  });

  it("filters by free-text search across message and detail", () => {
    expect(filterLogEntries(entries, { ...EMPTY_FILTERS, searchText: "stack trace" })).toEqual([entries[2]]);
    expect(filterLogEntries(entries, { ...EMPTY_FILTERS, searchText: "flag" })).toEqual([entries[1]]);
  });

  it("combines multiple filters with AND semantics", () => {
    const result = filterLogEntries(entries, {
      ...EMPTY_FILTERS,
      levels: new Set(["warn", "error"]),
      searchText: "bad",
    });
    expect(result).toEqual([entries[2]]);
  });
});
