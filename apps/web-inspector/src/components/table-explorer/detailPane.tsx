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
      <SidePanel side="right" widthClassName={inspectorDetailPaneWidthClassName} className="bg-background">
        <SidePanel.Header className="border-l border-border bg-background">
          <SidePanel.CloseButton />
          <SidePanel.Title>{title}</SidePanel.Title>
        </SidePanel.Header>
        <SidePanel.Content className="mt-0 border-l border-border bg-background p-3">
          {children}
        </SidePanel.Content>
        {footer !== undefined ? (
          <SidePanel.Footer className="border-l border-border bg-background">{footer}</SidePanel.Footer>
        ) : null}
      </SidePanel>
    </SidePanel.Provider>
  );
}
