import { PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"

import {
  AsChildProp,
  ClassNameProp,
  RefProp,
  StyleProp,
} from "types/base-props"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

interface ScrollAreaProps
  extends RefProp<HTMLDivElement>, ClassNameProp, AsChildProp, StyleProp {
  onScroll?: () => void
  innerClassName?: string
}

export const ScrollArea = ({
  ref,
  className,
  innerClassName,
  children,
  asChild,
  style,
  onScroll,
}: PropsWithChildren<ScrollAreaProps>) => {
  const Inner = asChild ? Slot : "div"
  return (
    <div style={style} className={cn("overflow-hidden", vstack({}), className)}>
      <Inner
        ref={ref}
        onScroll={onScroll}
        className={cn("w-full flex-1 overflow-auto", innerClassName)}
      >
        {children}
      </Inner>
    </div>
  )
}
