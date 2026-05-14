import * as React from "react"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type CheckboxProps = Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
  onCheckedChange?: (checked: boolean) => void
}

function Checkbox({
  className,
  checked,
  disabled,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  return (
    <label className="relative inline-flex size-4 shrink-0">
      <input
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          onCheckedChange?.(event.currentTarget.checked === true)
        }}
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none relative flex size-4 items-center justify-center rounded-[4px] border border-input bg-background text-transparent transition-shadow",
          "peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
          className,
        )}
      >
        <CheckIcon className="size-3.5" />
      </span>
    </label>
  )
}

Checkbox.displayName = "Checkbox"

export { Checkbox }
