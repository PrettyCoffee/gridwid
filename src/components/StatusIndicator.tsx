import { VariantProps, cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

const statusIndicator = cva(
  cn(
    "absolute top-2 right-2 inline-bock h-2 w-2 rounded-full",
    "after:absolute after:inset-0 after:rounded-full after:animate-ping"
  ),
  {
    variants: {
      kind: {
        neutral: "bg-foreground/75 after:bg-foreground",
        success: "bg-success/75 after:bg-success",
        warning: "bg-warning/75 after:bg-warning",
        error: "bg-error/75 after:bg-error",
        info: "bg-info/75 after:bg-info",
      },
    },
    defaultVariants: {
      kind: "info",
    },
  }
)

export const StatusIndicator = (
  props: VariantProps<typeof statusIndicator>
) => <span className={statusIndicator(props)} />
