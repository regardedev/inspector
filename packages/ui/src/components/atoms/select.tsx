import * as React from "react"

import {
  Select as ShadSelect,
  SelectContent as ShadSelectContent,
  SelectGroup as ShadSelectGroup,
  SelectItem as ShadSelectItem,
  SelectLabel as ShadSelectLabel,
  SelectScrollDownButton as ShadSelectScrollDownButton,
  SelectScrollUpButton as ShadSelectScrollUpButton,
  SelectSeparator as ShadSelectSeparator,
  SelectTrigger as ShadSelectTrigger,
  SelectValue as ShadSelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

const Select = ({ ...props }: React.ComponentProps<typeof ShadSelect>) => <ShadSelect {...props} />
Select.displayName = "Select"

function SelectContent({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadSelectContent>) {
  return (
    <ShadSelectContent
      ref={ref}
      className={cn("rounded-xs", className)}
      {...props}
    />
  )
}
SelectContent.displayName = "SelectContent"

const SelectGroup = ({ ...props }: React.ComponentProps<typeof ShadSelectGroup>) => <ShadSelectGroup {...props} />
SelectGroup.displayName = "SelectGroup"

function SelectItem({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadSelectItem>) {
  return (
    <ShadSelectItem
      ref={ref}
      className={cn("rounded-none", className)}
      {...props}
    />
  )
}
SelectItem.displayName = "SelectItem"

const SelectLabel = ({ ...props }: React.ComponentProps<typeof ShadSelectLabel>) => <ShadSelectLabel {...props} />
SelectLabel.displayName = "SelectLabel"

const SelectScrollDownButton = ({ ...props }: React.ComponentProps<typeof ShadSelectScrollDownButton>) => <ShadSelectScrollDownButton {...props} />
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectScrollUpButton = ({ ...props }: React.ComponentProps<typeof ShadSelectScrollUpButton>) => <ShadSelectScrollUpButton {...props} />
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectSeparator = ({ ...props }: React.ComponentProps<typeof ShadSelectSeparator>) => <ShadSelectSeparator {...props} />
SelectSeparator.displayName = "SelectSeparator"

function SelectTrigger({
  ref,
  className,
  density,
  size,
  ...props
}: React.ComponentProps<typeof ShadSelectTrigger> & {
  density?: "sm" | "default" | "lg"
}) {
  const resolvedSize = density === "sm" ? "sm" : size;

  return (
    <ShadSelectTrigger
      ref={ref}
      size={resolvedSize}
      className={cn("rounded-xs", density === "lg" ? "h-8 text-sm md:text-sm" : null, className)}
      {...props}
    />
  )
}
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ ...props }: React.ComponentProps<typeof ShadSelectValue>) => <ShadSelectValue {...props} />
SelectValue.displayName = "SelectValue"

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
