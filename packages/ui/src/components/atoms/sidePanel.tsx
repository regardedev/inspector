'use client'

import * as React from "react"
import { Drawer } from "@base-ui/react/drawer"
import { XIcon } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/atoms/button"

type SidePanelSide = "left" | "right"

interface SidePanelContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  toggle: () => void
}

const SidePanelContext = React.createContext<SidePanelContextValue | null>(null)

function useSidePanel(): SidePanelContextValue {
  const context = React.useContext(SidePanelContext)
  if (context === null) {
    throw new Error("useSidePanel must be used within SidePanel.Provider")
  }

  return context
}

function Header({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex h-9 items-center gap-2 px-2 md:bg-background md:border-border md:border-b", className)} {...props}>
      {children}
    </div>
  )
}
Header.displayName = "SidePanelHeader"

function Content({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 overflow-auto p-2 mt-4", className)} {...props}>{children}</div>
}
Content.displayName = "SidePanelContent"

function Footer({ className, children, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 px-2 py-2 border-t", className)} {...props}>{children}</div>
}
Footer.displayName = "SidePanelFooter"

function Title({ className, children, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-sm font-medium text-foreground", className)} {...props}>{children}</h2>
}
Title.displayName = "SidePanelTitle"

function Description({ className, children, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-sm text-muted-foreground", className)} {...props}>{children}</p>
}
Description.displayName = "SidePanelDescription"

export type CloseButtonProps = React.ComponentProps<typeof Button>

function CloseButton({ className, ...props }: CloseButtonProps) {
  const { onOpenChange } = useSidePanel()

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={() => onOpenChange(false)}
      className={cn("shrink-0 -ml-1", className)}
      {...props}
    >
      <XIcon />
      <span className="sr-only">Close</span>
    </Button>
  )
}
CloseButton.displayName = "SidePanelCloseButton"

function InlinePanel({
  children,
  className,
  widthClassName,
}: {
  children: React.ReactNode
  className?: string
  side: SidePanelSide
  widthClassName: string
}) {
  const { open } = useSidePanel()

  return (
    <div
      className={cn(
        "flex-col bg-popover h-full overflow-hidden shrink-0",
        "transition-all duration-200 ease-in-out",
        className,
        open === true ? `${widthClassName} opacity-100` : "w-0 opacity-0"
      )}
    >
      <div className={cn("relative flex flex-col h-full overflow-auto", widthClassName)}>
        {children}
      </div>
    </div>
  )
}
InlinePanel.displayName = "SidePanelInline"

function DrawerPanel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { open, onOpenChange } = useSidePanel()

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} swipeDirection="down" modal>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-black/10 data-ending-style:opacity-0" />
        <Drawer.Viewport className="fixed inset-x-0 bottom-0 z-50">
          <Drawer.Popup className={cn("bg-popover shadow-lg flex flex-col w-full rounded-t-xl border-t max-h-[80vh] data-ending-style:translate-y-full", className)}>
            <div className="mx-auto mt-4 h-1 w-12 rounded-full bg-muted" />
            <Drawer.Content className="relative flex flex-col overflow-auto p-4">
              {children}
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
DrawerPanel.displayName = "SidePanelDrawer"

function Panel({
  children,
  className,
  side = "right",
  widthClassName = "w-100",
}: {
  children: React.ReactNode
  className?: string
  side?: SidePanelSide
  widthClassName?: string
}) {
  const isMobile = useIsMobile()

  if (isMobile === true) {
    return <DrawerPanel className={className}>{children}</DrawerPanel>
  }

  return <InlinePanel className={className} side={side} widthClassName={widthClassName}>{children}</InlinePanel>
}
Panel.displayName = "SidePanel"

interface ProviderProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

function Provider({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ProviderProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const isControlled = controlledOpen !== undefined
  const open = isControlled === true ? controlledOpen : uncontrolledOpen

  const handleOpenChange = React.useCallback(
    (nextOpen: boolean) => {
      if (isControlled === false) {
        setUncontrolledOpen(nextOpen)
      }

      if (controlledOnOpenChange !== undefined) {
        controlledOnOpenChange(nextOpen)
      }
    },
    [controlledOnOpenChange, isControlled]
  )

  const toggle = React.useCallback(() => {
    handleOpenChange(open === false)
  }, [handleOpenChange, open])

  return (
    <SidePanelContext.Provider value={{ open, onOpenChange: handleOpenChange, toggle }}>
      {children}
    </SidePanelContext.Provider>
  )
}
Provider.displayName = "SidePanelProvider"

const SidePanel = Object.assign(Panel, {
  Provider,
  useSidePanel,
  CloseButton,
  Header,
  Content,
  Footer,
  Title,
  Description,
})

export { SidePanel }
export default SidePanel
export type { SidePanelContextValue }
