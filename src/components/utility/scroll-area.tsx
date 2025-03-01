import { forwardRef, PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"

import { AsChildProp, ClassNameProp, StyleProp } from "types/base-props"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

interface ScrollAreaProps extends ClassNameProp, AsChildProp, StyleProp {
  onScroll?: () => void
}

export const ScrollArea = forwardRef<
  HTMLDivElement,
  PropsWithChildren<ScrollAreaProps>
>(({ className, children, asChild, style, onScroll }, ref) => {
  const Inner = asChild ? Slot : "div"
  return (
    <div style={style} className={cn("overflow-hidden", vstack({}), className)}>
      <Inner
        ref={ref}
        onScroll={onScroll}
        className="w-full flex-1 overflow-auto"
      >
        {children}
      </Inner>
    </div>
  )
})
ScrollArea.displayName = "ScrollArea"
