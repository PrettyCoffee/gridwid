import { PropsWithChildren } from "react"

import { TooltipContentProps } from "@radix-ui/react-tooltip"

import { AsChildProp, TitleProp } from "types/base-props"

import { Tooltip } from "./tooltip"

export interface TitleTooltipProps extends TitleProp, AsChildProp {
  side?: TooltipContentProps["side"]
  force?: boolean
}
export const TitleTooltip = ({
  title,
  asChild,
  side,
  children,
  force,
}: PropsWithChildren<TitleTooltipProps>) =>
  !title ? (
    children
  ) : (
    <Tooltip.Root open={force}>
      <Tooltip.Trigger asChild={asChild}>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content side={side}>{title}</Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  )
