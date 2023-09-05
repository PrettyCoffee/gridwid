import { forwardRef } from "react"

import { TooltipPortal } from "@radix-ui/react-tooltip"
import { LucideIcon } from "lucide-react"

import { Button } from "~/components/ui/button"

import { ClassNameProp } from "./base/BaseProps"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export interface IconButtonProps extends ClassNameProp {
  icon: LucideIcon
  title: string
  onClick?: () => void
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, className, title, ...delegated }, ref) => {
    const button = (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={className}
        {...delegated}
      >
        <Icon absoluteStrokeWidth className="h-5" />
      </Button>
    )
    return !title ? (
      button
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>{title}</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    )
  }
)
IconButton.displayName = "IconButton"
