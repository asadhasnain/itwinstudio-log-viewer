import { parseLogText } from "../LogParser";

describe("parseLogText", () => {
  it("parses a simple log line with no payload", () => {
    const entries = parseLogText(
      "2026-10-24 12:13:00.495 [info] |iTwinStudio.Frontend| --- iTwin Studio Frontend starting --- "
    );

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      timestamp: "2026-10-24 12:13:00.495",
      level: "info",
      category: "iTwinStudio.Frontend",
      message: "--- iTwin Studio Frontend starting ---",
    });
    expect(entries[0].detail).toBeUndefined();
  });

  it("attaches a pretty-printed JSON payload to the preceding log line", () => {
    const text = [
      "2026-10-24 12:12:58.470 [info] |iTwinStudio.Root| Launching iTwin Studio app ",
      "{",
      '  "appId": "its-log-viewer",',
      '  "wasLaunchedForDevelopment": true',
      "}",
      "2026-10-24 12:12:58.470 [info] |iTwinStudio.Root| Fetching manifest at D:\\\\AI\\\\app.config.json ",
    ].join("\n");

    const entries = parseLogText(text);

    expect(entries).toHaveLength(2);
    expect(entries[0].message).toBe("Launching iTwin Studio app");
    expect(entries[0].detail).toBe('{\n  "appId": "its-log-viewer",\n  "wasLaunchedForDevelopment": true\n}');
    expect(entries[1].detail).toBeUndefined();
  });

  it("attaches multi-line stack traces and trailing JSON to error entries", () => {
    const text = [
      "2026-10-24 12:13:37.928 [error] |its-log-viewer| Bad Request: IModel is not open for rpc",
      "Bad Request: IModel is not open for rpc",
      "    at BriefcaseConnection.getRpcProps (electron://frontend/assets/App.js:136078:13)",
      "    at ViewCreator3d.createDefaultView (electron://frontend/assets/App.js:292624:77)",
      "{",
      '  "exceptionType": "IModelError"',
      "}",
    ].join("\n");

    const entries = parseLogText(text);

    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe("error");
    expect(entries[0].category).toBe("its-log-viewer");
    expect(entries[0].detail).toContain("at BriefcaseConnection.getRpcProps");
    expect(entries[0].detail).toContain('"exceptionType": "IModelError"');
  });

  it("distinguishes entries by level and category across multiple lines", () => {
    const text = [
      "2026-10-24 12:13:00.564 [warn] |iTwinStudio.Common| LaunchDarkly client is not initialized. Returning default value for flag: elastic-integration ",
      "{",
      '  "key": "elastic-integration",',
      '  "defaultValue": false',
      "}",
      "2026-10-24 12:13:00.564 [info] |iTwinStudio.Backend| OTLP initialization skipped due to LaunchDarkly feature flag ",
    ].join("\n");

    const entries = parseLogText(text);

    expect(entries.map((e) => e.level)).toEqual(["warn", "info"]);
    expect(entries.map((e) => e.category)).toEqual(["iTwinStudio.Common", "iTwinStudio.Backend"]);
  });
});
