import { cva, VariantProps } from "class-variance-authority"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

const divider = cva("block shrink-0", {
  variants: {
    color: {
      text: "bg-text",
      default: "bg-text-gentle",
      gentle: "bg-text-gentle opacity-50",
    },
    orientation: {
      horizontal: "h-px w-full",
      vertical: "h-full w-px",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
    color: "default",
  },
})

interface DividerProps extends ClassNameProp, VariantProps<typeof divider> {}

export const Divider = ({
  orientation,
  color,
  className,
  ...props
}: DividerProps) => (
  <span className={cn(divider({ orientation, color }), className)} {...props} />
)
