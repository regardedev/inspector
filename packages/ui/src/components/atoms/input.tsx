import * as React from "react"
import { Input as ShadInput } from "@/components/ui/input"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "text-foreground rounded-xs focus-visible:ring-0 focus:z-10",
  {
    variants: {
      variant: {
        default: "bg-input border-border",
        ghost:
          "border-none bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
      },
      density: {
        default: null,
        sm: "h-6 text-xs/relaxed md:text-xs/relaxed",
        lg: "h-8 text-sm md:text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      density: "default",
    },
  }
)

export type InputProps = React.ComponentProps<typeof ShadInput> &
  VariantProps<typeof inputVariants> & {
    preSlot?: React.ReactNode
    postSlot?: React.ReactNode
  }

function Input({
  ref,
  preSlot,
  postSlot,
  variant = "default",
  density = "default",
  className,
  ...props
}: InputProps) {
  return (
    <div className="relative flex w-full">
      {preSlot && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-muted-foreground">
          {preSlot}
        </div>
      )}
      <ShadInput
        ref={ref}
        className={cn(
          inputVariants({ variant, density }),
          preSlot && "pl-9",
          postSlot && "pr-9",
          className
        )}
        {...props}
      />
      {postSlot && (
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-center pr-3 text-muted-foreground">
          {postSlot}
        </div>
      )}
    </div>
  )
}

Input.displayName = "Input"
export { Input }
export default Input
