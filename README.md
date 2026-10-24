# its-log-viewer-app

A vibe coded iTwin Studio app for viewing and filtering iTwin Studio log files. Load a `.zip` archive (containing one or more `*.log` files) or a plain `.log`/`.txt` file via a native file picker, then browse the parsed entries in a sortable, filterable table.

## Features

- **Load logs**: pick a `.zip` archive or a plain `.log`/`.txt` file via the "Load Log File..." button.
- **Parses the iTwin Studio log format**: `TIMESTAMP [level] |Category| Message`, plus any following lines (pretty-printed JSON payloads, stack traces) attached as expandable detail.
- **Filter by level** (`trace`/`debug`/`info`/`warn`/`error`) using toggleable chips.
- **Filter by category** via a dropdown populated from the loaded log.
- **Filter by source file** when a zip contains multiple `.log` files.
- **Free-text search** across category, message, and detail text.
- **Expandable rows** to view the full JSON payload or stack trace for an entry.
- Live "Showing X of Y entries" count and a "Reset filters" button.

This app does not require an iModel or iTwin; `disableITwinSelection` is set in `app.config.json` so it opens directly to the log viewer.

## File Structure

- `backend/` - Code executed on the backend
  - `LogParser.ts` - parses raw log text into structured entries
  - `LogSource.ts` - reads a `.zip` archive (via `adm-zip`) or a plain log file and parses its contents
  - `IpcHandlers.ts` - IPC handler exposing `pickAndParseLogFile` (shows the native open-file dialog) to the frontend
- `frontend/` - Code executed on the frontend
  - `IpcClient.ts` - typed IPC proxy for calling the backend
  - `filterLogEntries.ts` - pure filtering logic for the log table
  - `components/LogViewerPage.tsx` - the log viewer UI (toolbar, filters, table)
  - `frontstages/LogViewerFrontstage.tsx` - registers the log viewer as the app's single frontstage
- `common/` - Shared types (`AppIpcDefinition.ts`, `Constants.ts`) used by both backend and frontend
- `e2e/` - End-to-end tests for automated testing
- `package.json` - [npm configuration file](https://docs.npmjs.com/cli/v11/configuring-npm/package-json)
- `app.config.json` - App configuration file that controls startup behavior and appearance in iTwin Studio

## Getting Started

### Prerequisites
1. [Install iTwin Studio](https://qa-itwinstudio.bentley.com/getting-started/download/)
2. [Enable developer support](https://qa-itwinstudio.bentley.com/getting-started/dev-support/)

### Using Visual Studio Code (Recommended)

1. Run `pnpm install`
2. Run the `Debug in Studio` launch configuration from the Run and Debug panel

### Using the Command Line

1. Run `pnpm install`
2. Run `pnpm dev` to build the app and start the file watcher for hot-reloading
3. Run `pnpm start` to launch iTwin Studio with your app
4. In the app, click **Load Log File...** and select a `.zip` archive or `.log`/`.txt` file to view and filter its entries

## Debugging

All templates include a debug configuration for Visual Studio Code in the `.vscode` folder.

- [Debugging in iTwin Studio](https://qa-itwinstudio.bentley.com/guides/supporting-docs/studio-repo)
- [Debugging in VS Code](https://qa-itwinstudio.bentley.com/guides/debugging)

## Testing

Run `pnpm test` to execute the Jest unit tests, including:

- `backend/tests/LogParser.test.ts` - verifies log line/payload/stack-trace parsing
- `frontend/tests/filterLogEntries.test.ts` - verifies level/category/source-file/text filtering logic

## Running E2E Tests

1. Create an `e2e/.env.local` file with the following variables:

```
STUDIO_TEST_USER_EMAIL=       # Test account email
STUDIO_TEST_USER_PASSWORD=    # Test account password (keep secret)
STUDIO_AUTHORITY=             # https://qa-ims.bentley.com or https://ims.bentley.com
ITWIN_NAME=                   # iTwin name (ensure test account has access)
```

2. Run `pnpm install`
3. Run `pnpm build`
4. Run `pnpm test-e2e`

See the [Studio wiki](https://qa-itwinstudio.bentley.com/guides/app-testing) for more on writing E2E tests.

## Additional Resources

- [iTwin Studio App Development FAQ](https://qa-itwinstudio.bentley.com/guides/faq) - Adding styles, settings, images, and more