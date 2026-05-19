import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

export type SearchProps = React.ComponentProps<"input"> & {
  preSlot?: React.ReactNode
}

function Search({
  ref,
  preSlot,
  className,
  ...props
}: SearchProps) {
  return (
    <div className="relative flex w-full">
      {preSlot && (
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3 text-muted-foreground">
          {preSlot}
        </div>
      )}
      <InputPrimitive
        ref={ref}
        data-slot="search"
        className={cn(
          "h-8 w-full min-w-0 rounded-none py-0 text-sm text-foreground transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          preSlot && "pl-9",
          className,
        )}
        {...props}
      />
    </div>
  )
}

Search.displayName = "Search"
export { Search }
export default Search
