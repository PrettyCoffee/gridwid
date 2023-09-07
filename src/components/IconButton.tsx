import { MouseEventHandler, forwardRef, useState } from "react"

import { TooltipPortal } from "@radix-ui/react-tooltip"
import { LucideIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type ButtonClick = MouseEventHandler<HTMLButtonElement>

export interface IconButtonProps extends ClassNameProp {
  icon: LucideIcon
  title: string
  onClick?: ButtonClick
  clickAnimation?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { icon: Icon, className, title, onClick, clickAnimation, ...delegated },
    ref
  ) => {
    const [animate, setAnimate] = useState(false)

    const handleClick: ButtonClick = (...args) => {
      onClick?.(...args)
      if (clickAnimation) setAnimate(true)
    }

    const button = (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={className}
        onAnimationEnd={() => setAnimate(false)}
        onClick={handleClick}
        {...delegated}
      >
        <Icon
          absoluteStrokeWidth
          className={cn("h-5", animate ? clickAnimation : "")}
        />
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
