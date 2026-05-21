import { XIcon } from "lucide-react"

import { Button } from "@/components/atoms/button"
import {
  Sheet as ShadSheet,
  SheetClose as ShadSheetClose,
  SheetContent as ShadSheetContent,
  SheetDescription as ShadSheetDescription,
  SheetFooter as ShadSheetFooter,
  SheetHeader as ShadSheetHeader,
  SheetTitle as ShadSheetTitle,
  SheetTrigger as ShadSheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export type SheetProps = React.ComponentProps<typeof ShadSheet>
export type SheetTriggerProps = React.ComponentProps<typeof ShadSheetTrigger>
export type SheetCloseProps = React.ComponentProps<typeof ShadSheetClose>
export type SheetContentProps = React.ComponentProps<typeof ShadSheetContent>
export type SheetHeaderProps = React.ComponentProps<typeof ShadSheetHeader>
export type SheetFooterProps = React.ComponentProps<typeof ShadSheetFooter>
export type SheetTitleProps = React.ComponentProps<typeof ShadSheetTitle>
export type SheetDescriptionProps = React.ComponentProps<typeof ShadSheetDescription>

export interface SidePanelProps {
  children: React.ReactNode
  description: string
  onClose: () => void
  title: string
}

const Sheet = ({ ...props }: SheetProps) => <ShadSheet {...props} />
Sheet.displayName = "Sheet"

const SheetTrigger = ({ ...props }: SheetTriggerProps) => <ShadSheetTrigger {...props} />
SheetTrigger.displayName = "SheetTrigger"

const SheetClose = ({ ...props }: SheetCloseProps) => <ShadSheetClose {...props} />
SheetClose.displayName = "SheetClose"

const SheetContent = ({ className, ...props }: SheetContentProps) => (
  <ShadSheetContent className={cn(className)} {...props} />
)
SheetContent.displayName = "SheetContent"

const SheetHeader = ({ className, ...props }: SheetHeaderProps) => (
  <ShadSheetHeader className={cn(className)} {...props} />
)
SheetHeader.displayName = "SheetHeader"

const SheetFooter = ({ className, ...props }: SheetFooterProps) => (
  <ShadSheetFooter className={cn(className)} {...props} />
)
SheetFooter.displayName = "SheetFooter"

const SheetTitle = ({ className, ...props }: SheetTitleProps) => (
  <ShadSheetTitle className={cn(className)} {...props} />
)
SheetTitle.displayName = "SheetTitle"

const SheetDescription = ({ className, ...props }: SheetDescriptionProps) => (
  <ShadSheetDescription className={cn(className)} {...props} />
)
SheetDescription.displayName = "SheetDescription"

function SidePanel({ children, description, onClose, title }: SidePanelProps) {
  return (
    <Sheet
      open={true}
      onOpenChange={(open) => {
        if (open === false) {
          onClose()
        }
      }}
    >
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[min(100vw,25rem)] max-w-none border-l border-border bg-background p-0 sm:max-w-none"
      >
        <SheetHeader className="flex h-11 shrink-0 flex-row items-center justify-between border-b border-border p-3">
          <div className="min-w-0 space-y-0.5">
            <SheetTitle className="rounded-xs px-1 py-1 text-sm leading-[1.4] font-normal text-foreground">
              {title}
            </SheetTitle>
            <SheetDescription className="sr-only">{description}</SheetDescription>
          </div>
          <Button type="button" variant="ghost" size="icon-sm" onClick={onClose} className="-mr-1 shrink-0">
            <XIcon />
            <span className="sr-only">Close</span>
          </Button>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col p-3 text-sm leading-[1.4] text-foreground">{children}</div>
      </SheetContent>
    </Sheet>
  )
}
SidePanel.displayName = "SidePanel"

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SidePanel,
}
