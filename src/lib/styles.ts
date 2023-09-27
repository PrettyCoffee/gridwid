import { cva } from "class-variance-authority"

import { cn } from "./utils"

export const noOverflow = cn(
  "overflow-hidden text-ellipsis whitespace-nowrap max-w-[100%]"
)

export const hover = cn("hover:bg-accent hover:text-accent-foreground")

export const press = cva(
  cn(
    "relative after:block after:absolute after:inset-0",
    "after:opacity-0 active:after:opacity-100"
  ),
  {
    variants: {
      style: {
        solid: "after:bg-background/25",
        gradient:
          "after:bg-gradient-to-br after:from-transparent after:to-background/50",
      },
    },
    defaultVariants: {
      style: "solid",
    },
  }
)

export const focusRing = cn(
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
)
