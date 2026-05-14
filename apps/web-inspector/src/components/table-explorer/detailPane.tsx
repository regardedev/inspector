import { SidePanel } from "@regarde/ui/sidePanel";

import { inspectorDetailPaneWidthClassName } from "#/layout/inspectorShell";

interface DetailPaneProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  open: boolean;
  title: React.ReactNode;
  onOpenChange: (open: boolean) => void;
}

export function DetailPane({
  children,
  footer,
  open,
  title,
  onOpenChange,
}: DetailPaneProps): React.ReactElement {
  return (
    <SidePanel.Provider open={open} onOpenChange={onOpenChange}>
      <SidePanel
        side="right"
        widthClassName={inspectorDetailPaneWidthClassName}
        className="bg-background"
      >
        <SidePanel.Header className="border-l border-border bg-background">
          <SidePanel.Title className="flex min-w-0 flex-1 items-center">{title}</SidePanel.Title>
        </SidePanel.Header>
        <SidePanel.Content className="mt-0 flex min-h-0 flex-1 flex-col overflow-hidden border-l border-border bg-background p-0">
          {children}
        </SidePanel.Content>
        {footer !== undefined ? (
          <SidePanel.Footer className="border-l border-border bg-background">{footer}</SidePanel.Footer>
        ) : null}
      </SidePanel>
    </SidePanel.Provider>
  );
}
