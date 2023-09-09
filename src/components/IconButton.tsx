import { MouseEventHandler, forwardRef, useState } from "react"

import { Button } from "~/components/ui/button"

import { ClassNameProp } from "./base/BaseProps"
import { Icon, IconProp } from "./Icon"
import { TitleTooltip } from "./ui/tooltip"

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

    return (
      <TitleTooltip title={title} asChild>
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
      </TitleTooltip>
    )
  }
)
IconButton.displayName = "IconButton"
