import * as React from "react"

import { cn } from "@/lib/utils"

import { Button, type ButtonProps } from "@/components/atoms/button"

function ButtonGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="button-group"
      className={cn(
        "inline-flex h-7 items-stretch overflow-hidden rounded-sm border border-border bg-background",
        className
      )}
      {...props}
    />
  )
}

type ButtonGroupItemProps = ButtonProps & {
  selected?: boolean
}

function ButtonGroupItem({
  className,
  selected = false,
  children,
  ...props
}: ButtonGroupItemProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-pressed={selected}
      data-selected={selected}
      className={cn(
        "size-7 rounded-none border-0 border-l border-border bg-background px-0 text-muted-foreground shadow-none first:border-l-0 hover:bg-muted/40 hover:text-foreground focus-visible:z-10 data-[selected=true]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export { ButtonGroup, ButtonGroupItem }
