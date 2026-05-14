import * as React from "react"

import {
  Field as ShadField,
  FieldContent as ShadFieldContent,
  FieldDescription as ShadFieldDescription,
  FieldError as ShadFieldError,
  FieldGroup as ShadFieldGroup,
  FieldLabel as ShadFieldLabel,
  FieldLegend as ShadFieldLegend,
  FieldSeparator as ShadFieldSeparator,
  FieldSet as ShadFieldSet,
  FieldTitle as ShadFieldTitle,
} from "@/components/ui/field"
import { cn } from "@/lib/utils"

export type FieldProps = React.ComponentProps<typeof ShadField>

const Field = ({ className, ...props }: FieldProps) => <ShadField className={cn("gap-1", className)} {...props} />
Field.displayName = "Field"

const FieldContent = ({ ...props }: React.ComponentProps<typeof ShadFieldContent>) => <ShadFieldContent {...props} />
FieldContent.displayName = "FieldContent"

const FieldDescription = ({ ...props }: React.ComponentProps<typeof ShadFieldDescription>) => <ShadFieldDescription {...props} />
FieldDescription.displayName = "FieldDescription"

const FieldError = ({ ...props }: React.ComponentProps<typeof ShadFieldError>) => <ShadFieldError {...props} />
FieldError.displayName = "FieldError"

const FieldGroup = ({ ...props }: React.ComponentProps<typeof ShadFieldGroup>) => <ShadFieldGroup {...props} />
FieldGroup.displayName = "FieldGroup"

const FieldLabel = ({ ...props }: React.ComponentProps<typeof ShadFieldLabel>) => <ShadFieldLabel {...props} />
FieldLabel.displayName = "FieldLabel"

const FieldLegend = ({ ...props }: React.ComponentProps<typeof ShadFieldLegend>) => <ShadFieldLegend {...props} />
FieldLegend.displayName = "FieldLegend"

const FieldSeparator = ({ ...props }: React.ComponentProps<typeof ShadFieldSeparator>) => <ShadFieldSeparator {...props} />
FieldSeparator.displayName = "FieldSeparator"

const FieldSet = ({ ...props }: React.ComponentProps<typeof ShadFieldSet>) => <ShadFieldSet {...props} />
FieldSet.displayName = "FieldSet"

const FieldTitle = ({ ...props }: React.ComponentProps<typeof ShadFieldTitle>) => <ShadFieldTitle {...props} />
FieldTitle.displayName = "FieldTitle"

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}

export default Field
