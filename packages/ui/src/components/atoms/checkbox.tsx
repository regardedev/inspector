import * as React from "react"

import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

export type CheckboxProps = Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
  indeterminate?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

function Checkbox({
  className,
  checked,
  disabled,
  indeterminate = false,
  onCheckedChange,
  ...props
}: CheckboxProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (inputRef.current !== null) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label className="relative inline-flex size-4 shrink-0">
      <input
        ref={inputRef}
        type="checkbox"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(event) => {
          onCheckedChange?.(event.currentTarget.checked === true);
        }}
        {...props}
      />
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none relative flex size-4 items-center justify-center rounded-xs border border-input bg-background text-transparent transition-shadow",
          "peer-focus-visible:border-ring peer-focus-visible:ring-2 peer-focus-visible:ring-ring/30",
          "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          "peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground",
          indeterminate === true && "border-primary bg-primary text-primary-foreground",
          className,
        )}
      >
        {indeterminate === true ? (
          <span className="block h-0.5 w-2.5 rounded-full bg-primary-foreground" />
        ) : (
          <CheckIcon className="size-3.5" />
        )}
      </span>
    </label>
  );
}

Checkbox.displayName = "Checkbox"

export { Checkbox }
