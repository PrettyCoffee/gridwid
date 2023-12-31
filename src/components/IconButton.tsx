import { forwardRef, useState } from "react"

import { Button, ButtonProps } from "~/components/ui/button"

import { ClassNameProp } from "./base/BaseProps"
import { VisuallyHidden } from "./base/VisuallyHidden"
import { Icon, IconProp } from "./Icon"
import { TitleTooltip, TitleTooltipProps } from "./ui/tooltip"

export interface IconButtonProps
  extends ClassNameProp,
    IconProp,
    Pick<ButtonProps, "onClick" | "variant" | "disabled"> {
  title: string
  clickAnimation?: string
  titleSide?: TitleTooltipProps["side"]
  hideTitle?: boolean
  compact?: boolean
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

    const handleClick: ButtonProps["onClick"] = (...args) => {
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
          <VisuallyHidden>{title}</VisuallyHidden>
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
