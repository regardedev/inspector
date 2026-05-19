import {
  Group as BaseGroup,
  Panel as BasePanel,
  Separator as BaseSeparator,
  type GroupProps,
  type PanelProps,
  type SeparatorProps,
} from "react-resizable-panels"

import { cn } from "@/lib/utils"

function ResizableGroup({ className, ...props }: GroupProps) {
  return <BaseGroup className={cn("flex h-full w-full", className)} data-slot="resizable-panel-group" {...props} />
}
ResizableGroup.displayName = "ResizableGroup"

function ResizablePanel(props: PanelProps) {
  return <BasePanel data-slot="resizable-panel" {...props} />
}
ResizablePanel.displayName = "ResizablePanel"

function ResizableSeparator({
  className,
  ...props
}: SeparatorProps) {
  return (
    <BaseSeparator
      className={cn(
        "relative flex w-px shrink-0 items-center justify-center bg-border outline-none",
        "data-[resize-handle-active=drag]:w-[2px] data-[resize-handle-active=drag]:bg-primary",
        "focus-visible:bg-primary/40",
        className
      )}
      data-slot="resizable-separator"
      {...props}
    />
  )
}
ResizableSeparator.displayName = "ResizableSeparator"

export { ResizableGroup, ResizablePanel, ResizableSeparator }
export type { GroupProps, PanelProps, SeparatorProps }
