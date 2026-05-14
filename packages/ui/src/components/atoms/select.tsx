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

const Select = ({ ...props }: React.ComponentProps<typeof ShadSelect>) => <ShadSelect {...props} />
Select.displayName = "Select"

const SelectContent = ({ ...props }: React.ComponentProps<typeof ShadSelectContent>) => <ShadSelectContent {...props} />
SelectContent.displayName = "SelectContent"

const SelectGroup = ({ ...props }: React.ComponentProps<typeof ShadSelectGroup>) => <ShadSelectGroup {...props} />
SelectGroup.displayName = "SelectGroup"

const SelectItem = ({ ...props }: React.ComponentProps<typeof ShadSelectItem>) => <ShadSelectItem {...props} />
SelectItem.displayName = "SelectItem"

const SelectLabel = ({ ...props }: React.ComponentProps<typeof ShadSelectLabel>) => <ShadSelectLabel {...props} />
SelectLabel.displayName = "SelectLabel"

const SelectScrollDownButton = ({ ...props }: React.ComponentProps<typeof ShadSelectScrollDownButton>) => <ShadSelectScrollDownButton {...props} />
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectScrollUpButton = ({ ...props }: React.ComponentProps<typeof ShadSelectScrollUpButton>) => <ShadSelectScrollUpButton {...props} />
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectSeparator = ({ ...props }: React.ComponentProps<typeof ShadSelectSeparator>) => <ShadSelectSeparator {...props} />
SelectSeparator.displayName = "SelectSeparator"

const SelectTrigger = ({ ...props }: React.ComponentProps<typeof ShadSelectTrigger>) => <ShadSelectTrigger {...props} />
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
