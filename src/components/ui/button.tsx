import * as React from "react"
import { ButtonHTMLAttributes, PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { focusRing, press } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { AsChildProp, ClassNameProp } from "../base/BaseProps"

const buttonVariants = cva(
  [
    press({ style: "gradient" }),
    focusRing,
    "inline-flex items-center justify-center rounded-md text-sm font-medium overflow-hidden disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      variant: {
        default: "bg-button text-button-foreground hover:bg-button-hover",
        destructive:
          "bg-error/10 text-error border border-error hover:bg-error/20",
        highlight:
          "bg-accent/10 text-accent border border-accent hover:bg-accent/20",
        outline:
          "bg-transparent text-foreground border border-input bg-transparent hover:bg-hover",
        ghost: "bg-transparent text-foreground hover:bg-hover",
        link: "bg-transparent text-foreground underline-offset-4 hover:underline active:opacity-80 after:hidden",
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
        true: "text-accent hover:text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type NativeButtonProps = Pick<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onFocus" | "onBlur" | "onAnimationStart" | "onAnimationEnd" | "onClick"
>

export interface ButtonProps
  extends NativeButtonProps,
    VariantProps<typeof buttonVariants>,
    ClassNameProp,
    AsChildProp {}

const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(({ className, variant, size, asChild = false, active, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, active, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
