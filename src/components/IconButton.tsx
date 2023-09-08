import { MouseEventHandler, forwardRef, useState } from "react"

import { TooltipPortal } from "@radix-ui/react-tooltip"

import { Button } from "~/components/ui/button"

import { ClassNameProp } from "./base/BaseProps"
import { Icon, IconProp } from "./Icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

type ButtonClick = MouseEventHandler<HTMLButtonElement>

export interface IconButtonProps extends ClassNameProp, IconProp {
  title: string
  onClick?: ButtonClick
  clickAnimation?: string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, className, title, onClick, clickAnimation, ...delegated }, ref) => {
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
          icon={icon}
          size="md"
          color="current"
          className={animate ? clickAnimation : ""}
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
