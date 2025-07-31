import { VariantProps, cva } from "class-variance-authority"
import { LucideProps } from "lucide-react"

import { ClassNameProp, IconProp, RefProp } from "types/base-props"
import { cn } from "utils/cn"

const icon = cva("inline-block shrink-0", {
  variants: {
    size: {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
      xl: "size-8",
    },
    color: {
      default: "text-text",
      current: "text-current",
      highlight: "text-highlight",
      gentle: "text-text-gentle",
      muted: "text-text-muted",
      invert: "text-text-invert",

      info: "text-alert-info",
      warn: "text-alert-warn",
      error: "text-alert-error",
      success: "text-alert-success",
    },
    filled: {
      true: "fill-current",
      false: "",
    },
  },
  defaultVariants: {
    color: "default",
    size: "md",
  },
})

export type IconProps = Required<IconProp> &
  RefProp<SVGSVGElement> &
  ClassNameProp &
  VariantProps<typeof icon> &
  Pick<LucideProps, "strokeWidth">

export const Icon = ({
  ref,
  icon: Icon,
  className,
  strokeWidth,
  color,
  filled,
  size,
  ...delegated
}: IconProps) => (
  <Icon
    ref={ref}
    className={cn(icon({ color, filled, size }), className)}
    absoluteStrokeWidth={strokeWidth != null}
    strokeWidth={strokeWidth}
    {...delegated}
  />
)
