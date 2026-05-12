import type { CSSProperties } from "react";

export const inspectorShellStyle = {
  "--inspector-detail-pane-width": "25rem",
  "--inspector-list-pane-width": "15rem",
  "--inspector-rail-width": "3.5rem",
} as CSSProperties;

export const inspectorRailWidthClassName = "w-(--inspector-rail-width)";
export const inspectorListPaneWidthClassName = "w-(--inspector-list-pane-width)";
export const inspectorDetailPaneWidthClassName = "w-(--inspector-detail-pane-width)";
export const inspectorContentMaxWidthClassName = "max-w-(--inspector-detail-pane-width)";
