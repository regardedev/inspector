import * as React from "react"

import {
  Combobox as ShadCombobox,
  ComboboxCollection as ShadComboboxCollection,
  ComboboxContent as ShadComboboxContent,
  ComboboxEmpty as ShadComboboxEmpty,
  ComboboxGroup as ShadComboboxGroup,
  ComboboxInput as ShadComboboxInput,
  ComboboxItem as ShadComboboxItem,
  ComboboxLabel as ShadComboboxLabel,
  ComboboxList as ShadComboboxList,
  ComboboxSeparator as ShadComboboxSeparator,
  ComboboxTrigger as ShadComboboxTrigger,
  ComboboxValue as ShadComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { cn } from "@/lib/utils"

const Combobox = ShadCombobox

const ComboboxValue = ({ ...props }: React.ComponentProps<typeof ShadComboboxValue>) => (
  <ShadComboboxValue {...props} />
)
ComboboxValue.displayName = "ComboboxValue"

const ComboboxTrigger = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxTrigger>) => (
  <ShadComboboxTrigger
    ref={ref}
    className={cn("[&_svg]:last:hidden", className)}
    {...props}
  />
)
ComboboxTrigger.displayName = "ComboboxTrigger"

const ComboboxInput = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxInput>) => (
  <ShadComboboxInput
    ref={ref}
    className={cn(
      "w-full bg-transparent border-transparent shadow-none ring-0 [&_svg]:hidden",
      "[&_[data-slot=input-group-control]]:text-sm md:[&_[data-slot=input-group-control]]:text-sm",
      "[&_[data-slot=input-group-control]]:leading-5 md:[&_[data-slot=input-group-control]]:leading-5",
      "focus-within:border-transparent focus-within:ring-0",
      "has-[[data-slot=input-group-control]:focus-visible]:border-transparent",
      "has-[[data-slot=input-group-control]:focus-visible]:ring-0",
      className
    )}
    {...props}
  />
)
ComboboxInput.displayName = "ComboboxInput"

const ComboboxContent = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxContent>) => (
  <ShadComboboxContent
    ref={ref}
    className={cn("rounded-sm ring-foreground/10", className)}
    {...props}
  />
)
ComboboxContent.displayName = "ComboboxContent"

const ComboboxList = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxList>) => (
  <ShadComboboxList ref={ref} className={cn(className)} {...props} />
)
ComboboxList.displayName = "ComboboxList"

const ComboboxItem = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxItem>) => (
  <ShadComboboxItem ref={ref} className={cn("cursor-pointer rounded-sm", className)} {...props} />
)
ComboboxItem.displayName = "ComboboxItem"

const ComboboxGroup = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxGroup>) => (
  <ShadComboboxGroup ref={ref} className={cn(className)} {...props} />
)
ComboboxGroup.displayName = "ComboboxGroup"

const ComboboxLabel = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxLabel>) => (
  <ShadComboboxLabel ref={ref} className={cn("text-sm", className)} {...props} />
)
ComboboxLabel.displayName = "ComboboxLabel"

const ComboboxCollection = ({ ...props }: React.ComponentProps<typeof ShadComboboxCollection>) => (
  <ShadComboboxCollection {...props} />
)
ComboboxCollection.displayName = "ComboboxCollection"

const ComboboxEmpty = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxEmpty>) => (
  <ShadComboboxEmpty ref={ref} className={cn("px-3 py-4 text-sm", className)} {...props} />
)
ComboboxEmpty.displayName = "ComboboxEmpty"

const ComboboxSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof ShadComboboxSeparator>) => (
  <ShadComboboxSeparator ref={ref} className={cn("my-0", className)} {...props} />
)
ComboboxSeparator.displayName = "ComboboxSeparator"

export {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
