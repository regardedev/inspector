import * as React from "react"

import { Textarea as ShadTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<typeof ShadTextarea>

function Textarea({ ref, className, ...props }: TextareaProps) {
  return (
    <ShadTextarea
      ref={ref}
      className={cn(
        "border-input bg-input/20 text-foreground rounded-xs focus-visible:ring-0 dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

Textarea.displayName = "Textarea"
export { Textarea }
export default Textarea
