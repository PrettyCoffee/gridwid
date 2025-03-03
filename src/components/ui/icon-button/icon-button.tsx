import { cva, VariantProps } from "class-variance-authority"

import { VisuallyHidden } from "components/utility/visually-hidden"
import { StyleProp } from "types/base-props"
import { cn } from "utils/cn"

import { Button, ButtonProps } from "../button"
import { Icon, IconProps } from "../icon"
import { TitleTooltip, TitleTooltipProps } from "../tooltip"

const iconButton = cva("shrink-0", {
  variants: {
    size: {
      md: "size-10",
      sm: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export interface IconButtonProps
  extends VariantProps<typeof iconButton>,
    Pick<IconProps, "icon" | "filled">,
    Omit<ButtonProps, "look" | "icon" | "asChild" | "isLoading">,
    StyleProp {
  title: string
  look?: Exclude<ButtonProps["look"], "link">
  titleSide?: TitleTooltipProps["side"]
  hideTitle?: boolean
}

export const IconButton = ({
  ref,
  icon,
  filled,
  title,
  look = "flat",
  size = "md",
  className,
  hideTitle,
  titleSide,
  ...delegated
}: IconButtonProps) => (
  <TitleTooltip title={hideTitle ? undefined : title} side={titleSide} asChild>
    <Button
      ref={ref}
      look={look}
      className={cn(iconButton({ size }), className)}
      {...delegated}
    >
      <VisuallyHidden>{title}</VisuallyHidden>
      <Icon icon={icon} size={size} color="current" filled={filled} />
    </Button>
  </TitleTooltip>
)
