import { VariantProps, cva } from "class-variance-authority"
import { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"

const icon = cva("shrink-0", {
  variants: {
    size: {
      xs: "h-3 w-3",
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-8 w-8",
    },
    color: {
      default: "text-foreground",
      current: "text-current",
      accent: "text-accent",
      muted: "text-muted-foreground",
      error: "text-error",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
})

export interface IconProp {
  icon: LucideIcon
}

export type IconProps = IconProp &
  ClassNameProp &
  VariantProps<typeof icon> &
  Pick<LucideProps, "strokeWidth">

export const Icon = ({
  icon: Icon,
  className,
  strokeWidth,
  ...styles
}: IconProps) => (
  <Icon
    className={cn(icon(styles), className)}
    absoluteStrokeWidth={strokeWidth == null}
    strokeWidth={strokeWidth ?? styles.size === "xs" ? 3 : undefined}
  />
)
