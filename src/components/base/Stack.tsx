import { PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"

import { cn } from "~/lib/utils"

import { AsChildProp, ClassNameProp } from "./BaseProps"

const stack = cva("flex", {
  variants: {
    items: {
      start: "items-start",
      center: "items-center",
      stretch: "items-stretch",
      end: "items-end",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      evenly: "justify-evenly",
      around: "justify-around",
    },
    gap: {
      "0": "gap-0",
      "1": "gap-1",
      "2": "gap-2",
      "4": "gap-4",
    },
    wrap: {
      true: "flex-wrap",
    },
  },
})

export type StackProps = VariantProps<typeof stack> &
  AsChildProp &
  ClassNameProp

export const HStack = ({
  children,
  asChild,
  className,
  ...styles
}: PropsWithChildren<StackProps>) => {
  const Element = asChild ? Slot : "div"
  return (
    <Element className={cn("flex-row", stack(styles), className)}>
      {children}
    </Element>
  )
}

export const VStack = ({
  children,
  asChild,
  className,
  ...styles
}: PropsWithChildren<StackProps>) => {
  const Element = asChild ? Slot : "div"
  return (
    <Element className={cn("flex-col", stack(styles), className)}>
      {children}
    </Element>
  )
}
