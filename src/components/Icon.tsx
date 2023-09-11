import { VariantProps, cva } from "class-variance-authority"
import { LucideIcon } from "lucide-react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"

const icon = cva("", {
  variants: {
    size: {
      sm: "h-4 w-4",
      md: "h-5 w-5",
      lg: "h-8 w-8",
    },
    color: {
      default: "text-foreground",
      current: "text-current",
      accent: "text-accent-foreground",
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

export type IconProps = IconProp & ClassNameProp & VariantProps<typeof icon>

export const Icon = ({ icon: Icon, className, ...styles }: IconProps) => (
  <Icon className={cn(icon(styles), className)} absoluteStrokeWidth />
)
