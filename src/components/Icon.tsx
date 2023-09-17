import { VariantProps, cva } from "class-variance-authority"
import { LucideIcon, LucideProps } from "lucide-react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"

const icon = cva("", {
  variants: {
    size: {
      sm: "h-4 w-4 min-h-[theme(height.4)] min-w-[theme(width.4)]",
      md: "h-5 w-5 min-h-[theme(height.5)] min-w-[theme(width.5)]",
      lg: "h-8 w-8 min-h-[theme(height.8)] min-w-[theme(width.8)]",
    },
    color: {
      default: "text-foreground",
      current: "text-current",
      accent: "text-accent-foreground",
      primary: "text-primary-foreground",
      muted: "text-muted-foreground",
      highlight: "text-highlight-foreground",
      destructive: "text-destructive-foreground",
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
    strokeWidth={strokeWidth}
  />
)
