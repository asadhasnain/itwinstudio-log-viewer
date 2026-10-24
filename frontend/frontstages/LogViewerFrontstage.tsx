import React from "react";
import {
  ContentGroup,
  ContentGroupProvider,
  FrontstageUtilities,
  StageUsage,
  StandardContentLayouts,
} from "@itwin/appui-react";
import { LogViewerPage } from "../components/LogViewerPage";

export const frontstageId = "LogViewerFrontstageId";

/** A ContentGroupProvider that provides a ContentGroup with the log viewer page (no iModel needed). */
class LogViewerContentGroupProvider extends ContentGroupProvider {
  public override async contentGroup(): Promise<ContentGroup> {
    return new ContentGroup({
      id: "log-viewer-content-group",
      layout: StandardContentLayouts.singleView,
      contents: [
        {
          id: "LogViewer",
          classId: "",
          content: <LogViewerPage />,
        },
      ],
    });
  }
}

export const getFrontstageProvider = () =>
  FrontstageUtilities.createStandardFrontstage({
    id: frontstageId,
    usage: StageUsage.General,
    contentGroupProps: new LogViewerContentGroupProvider(),
  });
