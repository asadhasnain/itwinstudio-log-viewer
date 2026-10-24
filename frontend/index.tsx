import { UiFramework } from "@itwin/appui-react";
import { Logger } from "@itwin/core-bentley";
import { type ITwin, StudioApp } from "@bentley/studio-apps-frontend-api";
import { LOG_CATEGORY } from "../common/Constants";
import { frontstageId, getFrontstageProvider } from "./frontstages/LogViewerFrontstage";
import "./styles.css";

export async function activateFrontend(): Promise<void> {
  Logger.logInfo(LOG_CATEGORY, "Hello World!");
  UiFramework.frontstages.addFrontstage(getFrontstageProvider());
  await UiFramework.frontstages.setActiveFrontstage(frontstageId);
}

export async function deactivateFrontend() {
  Logger.logInfo(LOG_CATEGORY, "Goodbye!");
}

/**
 * The iTwinSelected event is raised when the user selects an iTwin in the UI or when the iTwin is changed programmatically.
 * This is where you can add code to respond to the iTwin selection.
 * If you implement your own iTwin selection UI, you should call `StudioStartupApp.setITwin` when a new iTwin is selected in order to set the iTwin properly in the framework and trigger this event.
 * @param iTwin The iTwin that was selected.
 */
StudioApp.onITwinSelected((iTwin: ITwin) => {
  Logger.logInfo(LOG_CATEGORY, `ITwin selected: ${JSON.stringify(iTwin)}`);
});
