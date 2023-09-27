import * as React from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { focusRing, hover, press } from "~/lib/styles"
import { cn } from "~/lib/utils"

const buttonVariants = cva(
  [
    press({ style: "gradient" }),
    focusRing,
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors overflow-hidden disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90 after:to-background/30",
        destructive:
          "bg-destructive/10 text-destructive-foreground border border-destructive-foreground hover:bg-destructive/30 after:to-background/30",
        highlight:
          "bg-highlight/10 text-highlight-foreground border border-highlight-foreground hover:bg-highlight/30 after:to-background/30",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground after:to-background/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: hover,
        link: "text-primary underline-offset-4 hover:underline active:opacity-80",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-sm px-3",
        lg: "h-11 rounded-lg px-8",
        icon: "h-10 w-10 min-w-[theme(width.10)] min-h-[theme(height.10)] max-w-[theme(width.10)] max-h-[theme(height.10)]",
        compactIcon:
          "h-8 w-8 rounded-sm min-w-[theme(width.8)] min-h-[theme(height.8)] max-w-[theme(width.8)] max-h-[theme(height.8)]",
      },
      active: {
        true: "text-highlight-foreground hover:text-highlight-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, active, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, active, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
