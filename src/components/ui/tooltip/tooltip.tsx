import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { forwardRef } from "react"

import { cn } from "utils/cn"

const Provider = TooltipPrimitive.Provider

const Portal = TooltipPrimitive.Portal

const Root = TooltipPrimitive.Root

const Trigger = TooltipPrimitive.Trigger

const Content = forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "text-text border-text-gentle/25 bgl-base-b/75 shade-low z-50 overflow-hidden rounded-md border px-3 py-1.5 text-sm backdrop-blur-md",
      className
    )}
    {...props}
  />
))
Content.displayName = TooltipPrimitive.Content.displayName

const Tooltip = {
  Root,
  Trigger,
  Content,
  Portal,
  Provider,
}
export { Tooltip }
