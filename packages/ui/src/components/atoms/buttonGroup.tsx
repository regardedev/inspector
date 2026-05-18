import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import {
  ButtonGroup as ShadButtonGroup,
  ButtonGroupSeparator as ShadButtonGroupSeparator,
  ButtonGroupText as ShadButtonGroupText,
} from "@/components/ui/button-group"
import { cn } from "@/lib/utils"

const buttonGroupVariants = cva(
  "inline-flex items-stretch overflow-hidden rounded-xs border border-border bg-background",
  {
    variants: {
      size: {
        sm: "h-6",
        default: "h-7",
        lg: "h-8",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const buttonGroupItemVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-1.5 rounded-none border-0 border-l border-border bg-background text-muted-foreground shadow-none outline-none transition-colors first:border-l-0 hover:bg-muted/40 hover:text-foreground focus-visible:z-10 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:bg-muted/60 disabled:pointer-events-none disabled:opacity-50 data-[selected=true]:bg-secondary data-[selected=true]:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      size: {
        sm: "h-6 w-6 text-[0.625rem] [&_svg:not([class*='size-'])]:size-3",
        default: "h-7 w-7 text-xs/relaxed [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-8 w-8 text-sm/relaxed [&_svg:not([class*='size-'])]:size-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

type ButtonGroupProps = React.ComponentProps<typeof ShadButtonGroup> &
  VariantProps<typeof buttonGroupVariants> & {
    fullWidth?: boolean
  }

function ButtonGroup({
  ref,
  className,
  size = "default",
  fullWidth = false,
  ...props
}: ButtonGroupProps) {
  return (
    <ShadButtonGroup
      ref={ref}
      className={cn(
        buttonGroupVariants({ size }),
        fullWidth === true && "flex w-full",
        className
      )}
      {...props}
    />
  )
}
ButtonGroup.displayName = "ButtonGroup"

type ButtonGroupItemProps = React.ComponentProps<"button"> & {
  selected?: boolean
  fill?: boolean
} & VariantProps<typeof buttonGroupItemVariants>

function ButtonGroupItem({
  ref,
  className,
  size = "default",
  fill = false,
  selected = false,
  children,
  ...props
}: ButtonGroupItemProps) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      data-selected={selected}
      className={cn(
        buttonGroupItemVariants({ size }),
        fill === true && "h-full flex-1 px-3",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
ButtonGroupItem.displayName = "ButtonGroupItem"

const ButtonGroupSeparator = ShadButtonGroupSeparator
const ButtonGroupText = ShadButtonGroupText

export { ButtonGroup, ButtonGroupItem, ButtonGroupSeparator, ButtonGroupText }
export default ButtonGroup
