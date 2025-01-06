import { Slot } from "@radix-ui/react-slot"
import { PropsWithChildren } from "react"

import { AsChildProp, ClassNameProp, StyleProp } from "types/base-props"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

export const ScrollArea = ({
  className,
  children,
  asChild,
  style,
}: PropsWithChildren<ClassNameProp & AsChildProp & StyleProp>) => {
  const Inner = asChild ? Slot : "div"
  return (
    <div style={style} className={cn("overflow-hidden", vstack({}), className)}>
      <Inner className="w-full flex-1 overflow-auto">{children}</Inner>
    </div>
  )
}
