import { ComponentProps } from "react"

import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "utils/cn"
import { surface } from "utils/styles"
import { zIndex } from "utils/z-index"

const PopoverContent = ({
  ref,
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ComponentProps<typeof PopoverPrimitive.Content>) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        surface({ look: "overlay", size: "md" }),
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        zIndex.popover,
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
)

const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger: PopoverPrimitive.Trigger,
  Content: PopoverContent,
  Close: PopoverPrimitive.Close,
}

export { Popover }
