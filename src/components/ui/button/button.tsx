import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { PropsWithChildren } from "react"

import {
  AsChildProp,
  ClassNameProp,
  DisableProp,
  IconProp,
} from "types/base-props"
import { cn } from "utils/cn"
import { focusRing, interactive, InteractiveProps } from "utils/styles"

import { Icon } from "../icon"
import { Spinner } from "../spinner"

const button = cva(
  cn(
    focusRing,
    "relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium"
  ),
  {
    variants: {
      size: {
        md: "h-10 px-3",
        sm: "h-8 px-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type ButtonHtmlProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export interface ButtonProps
  extends Pick<ButtonHtmlProps, "onClick" | "onFocus" | "onBlur">,
    IconProp,
    ClassNameProp,
    AsChildProp,
    DisableProp,
    VariantProps<typeof button>,
    InteractiveProps {
  isLoading?: boolean
}

const Button = React.forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
>(
  (
    {
      className,
      look = "flat",
      size = "md",
      asChild = false,
      children,
      isLoading,
      icon,
      active,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          interactive({ look, active, disabled }),
          button({ size, className })
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <Spinner size={"sm"} color="current" className="mr-2" />
        ) : icon ? (
          <Icon
            icon={icon}
            size={size === "sm" ? "sm" : "md"}
            className="mr-2 text-current"
          />
        ) : null}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, button }
