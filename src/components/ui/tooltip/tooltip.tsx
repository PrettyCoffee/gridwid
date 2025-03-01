import { ComponentProps } from "react"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "utils/cn"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const Content = ({
  ref,
  className,
  sideOffset = 4,
  ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      surface({ look: "overlay", size: "md" }),
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "overflow-hidden px-3 py-1.5 text-sm",
      zIndex.tooltip,
      className
    )}
    {...props}
  />
)

const { Root, Trigger, Portal, Provider } = TooltipPrimitive

const Tooltip = {
  Root,
  Trigger,
  Content,
  Portal,
  Provider,
}
export { Tooltip }
