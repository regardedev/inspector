import {
  Badge as ReuiBadge,
  badgeVariants,
  type BadgeProps as ReuiBadgeProps,
} from "@/components/reui/badge"
import { cn } from "@/lib/utils"

interface BadgeProps extends Omit<ReuiBadgeProps, "size"> {
  size?: ReuiBadgeProps["size"] | "count"
}

function Badge({ className, size, ...props }: BadgeProps) {
  const isCount = size === "count"

  return (
    <ReuiBadge
      size={isCount === true ? undefined : size}
      className={cn(
        isCount === true ? "h-4 min-w-4 gap-0 px-1 py-0 text-[0.625rem] leading-none" : null,
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants, type BadgeProps }
