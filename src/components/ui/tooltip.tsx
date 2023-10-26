import * as React from "react"

import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "~/lib/utils"

import { AsChildProp, TitleProp } from "../base/BaseProps"

const Provider = TooltipPrimitive.Provider

const Portal = TooltipPrimitive.Portal

const Root = TooltipPrimitive.Root

const Trigger = TooltipPrimitive.Trigger

const Content = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-background px-3 py-1.5 text-sm text-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
Content.displayName = TooltipPrimitive.Content.displayName

export interface TitleTooltipProps extends TitleProp, AsChildProp {
  side?: TooltipPrimitive.TooltipContentProps["side"]
}
const TitleTooltip = ({
  title,
  asChild,
  side,
  children,
}: React.PropsWithChildren<TitleTooltipProps>) =>
  !title ? (
    children
  ) : (
    <Root>
      <Trigger asChild={asChild}>{children}</Trigger>
      <Portal>
        <Content side={side}>{title}</Content>
      </Portal>
    </Root>
  )

const Tooltip = {
  Root,
  Trigger,
  Content,
  Portal,
  Provider,
}
export { Tooltip, TitleTooltip }
