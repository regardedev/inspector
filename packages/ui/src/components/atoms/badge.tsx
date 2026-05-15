import * as React from "react"
import { Badge as ShadBadge } from "@/components/ui/badge"
import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!",
  {
    variants: {
      variant: {
        default: "rounded-sm bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "rounded-sm bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "rounded-sm bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "rounded-sm border-border bg-input/20 text-foreground hover:bg-muted dark:bg-input/30",
        ghost:
          "rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
        link: "h-auto rounded-none px-0 py-0 text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.ComponentProps<typeof ShadBadge> & VariantProps<typeof badgeVariants>

/**
 * @example
 * ```tsx
 * <Badge variant="outline">Draft</Badge>
 * ```
 */
function Badge({
  ref,
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  const baseClasses = twMerge(badgeVariants({ variant, className }))

  return <ShadBadge ref={ref} className={baseClasses} {...props} />
}

Badge.displayName = "Badge"

export default Badge
export { Badge }
