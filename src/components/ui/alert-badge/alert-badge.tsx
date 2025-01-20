import { useRef } from "react"

import { VariantProps, cva } from "class-variance-authority"

import { cn } from "utils/cn"

const alertBadge = cva(
  [
    "inline-bock absolute right-2 top-2 size-2 rounded-full transition-opacity duration-300 ease-in-out",
    "after:absolute after:inset-0 after:animate-ping after:rounded-full",
  ],
  {
    variants: {
      kind: {
        success: "bg-alert-success/75 after:bg-alert-success",
        warn: "bg-alert-warn/75 after:bg-alert-warn",
        error: "bg-alert-error/75 after:bg-alert-error",
        info: "bg-alert-info/75 after:bg-alert-info",
      },
      hidden: {
        true: "opacity-0",
        false: "opacity-100",
      },
    },
    defaultVariants: {
      kind: "info",
      hidden: false,
    },
  }
)

export const AlertBadge = ({
  kind,
  ...props
}: VariantProps<typeof alertBadge>) => {
  const lastKind = useRef(kind)
  if (kind) {
    lastKind.current = kind
  }
  return (
    <span className={cn(alertBadge({ kind: lastKind.current, ...props }))} />
  )
}
