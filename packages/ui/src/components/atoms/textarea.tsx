import * as React from "react"

import { Textarea as ShadTextarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentProps<typeof ShadTextarea>

function Textarea({ ref, className, ...props }: TextareaProps) {
  return (
    <ShadTextarea
      ref={ref}
      className={cn(
        "bg-input border-border text-foreground rounded-sm focus-visible:ring-0",
        className
      )}
      {...props}
    />
  )
}

Textarea.displayName = "Textarea"
export { Textarea }
export default Textarea
