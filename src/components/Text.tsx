import { PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"

import { noOverflow } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { AsChildProp, ClassNameProp } from "./base/BaseProps"

const text = cva("p-0 m-0", {
  variants: {
    style: {
      small: "text-sm font-semibold leading-none",
      medium: "text-md font-medium leading-none",
      large: "text-lg font-semibold",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    noOverflow: {
      true: noOverflow,
    },
    color: {
      current: "text-current",
      default: "text-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent",
      destructive: "text-error",
    },
    block: {
      true: "block",
      false: "inline-block",
    },
  },
})

export interface TextProps
  extends ClassNameProp,
    AsChildProp,
    VariantProps<typeof text> {
  asChild?: boolean
}

export const Text = ({
  children,
  asChild,
  className,
  ...styles
}: PropsWithChildren<TextProps>) => {
  const Comp = asChild ? Slot : "span"
  return <Comp className={cn(text(styles), className)}>{children}</Comp>
}
