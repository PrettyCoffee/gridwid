import { MouseEventHandler, forwardRef, useState } from "react"

import { Button, ButtonProps } from "~/components/ui/button"

import { ClassNameProp } from "./base/BaseProps"
import { Icon, IconProp } from "./Icon"
import { TitleTooltip, TitleTooltipProps } from "./ui/tooltip"

type ButtonClick = MouseEventHandler<HTMLButtonElement>

export interface IconButtonProps extends ClassNameProp, IconProp {
  title: string
  onClick?: ButtonClick
  clickAnimation?: string
  titleSide?: TitleTooltipProps["side"]
  hideTitle?: boolean
  compact?: boolean
  variant?: ButtonProps["variant"]
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      title,
      onClick,
      clickAnimation,
      titleSide,
      compact,
      hideTitle,
      variant = "ghost",
      ...delegated
    },
    ref
  ) => {
    const [animate, setAnimate] = useState(false)

    const handleClick: ButtonClick = (...args) => {
      onClick?.(...args)
      if (clickAnimation) setAnimate(true)
    }

    return (
      <TitleTooltip
        title={hideTitle ? undefined : title}
        side={titleSide}
        asChild
      >
        <Button
          ref={ref}
          variant={variant}
          size={compact ? "compactIcon" : "icon"}
          onAnimationEnd={() => setAnimate(false)}
          onClick={handleClick}
          {...delegated}
        >
          <Icon
            icon={icon}
            size={compact ? "sm" : "md"}
            color="current"
            className={animate ? clickAnimation : ""}
          />
          {hideTitle && <span className="sr-only">{title}</span>}
        </Button>
      </TitleTooltip>
    )
  }
)
IconButton.displayName = "IconButton"
