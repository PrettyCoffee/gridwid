import { HTMLAttributeAnchorTarget, PropsWithChildren, ReactNode } from "react"

import { ClassNameProp, IconProp, RefProp } from "types/base-props"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Button } from "../button"
import { Icon } from "../icon"
import { IconButton, IconButtonProps } from "../icon-button"

export interface ListItemProps extends ClassNameProp, RefProp<HTMLLIElement> {
  active?: boolean
}

const Item = ({
  className,
  active,
  children,
  ...props
}: PropsWithChildren<ListItemProps>) => (
  <li
    {...props}
    className={cn(
      hstack({}),
      active ? "border-highlight/50" : "border-text-gentle/10",
      "h-10 list-none rounded-sm border bgl-base-b/10 *:h-full *:rounded-none hover:bgl-layer-w/5 [&>:first-child]:rounded-l-sm [&>:last-child]:rounded-e-sm",
      className
    )}
  >
    {children}
  </li>
)

export interface ListItemLabelProps
  extends ClassNameProp,
    IconProp,
    RefProp<HTMLButtonElement> {
  onClick?: () => void
  to?: RoutePath
  href?: string
  target?: HTMLAttributeAnchorTarget
  label?: ReactNode
  labelAttachment?: ReactNode
}

const Label = ({
  className,
  label,
  labelAttachment,
  icon,
  ...props
}: ListItemLabelProps) => (
  <Button
    {...props}
    className={cn(
      hstack({ justify: "start", align: "center" }),
      "flex-1 truncate",
      className
    )}
  >
    {icon && <Icon icon={icon} className="mr-2 -ml-1" />}
    <span className="truncate">{label}</span>
    {labelAttachment}
  </Button>
)

const Action = ({ className, ...props }: IconButtonProps) => (
  <IconButton
    {...props}
    hideTitle
    look="flat"
    className={cn("[*:not(:hover):not(:focus-within)>&]:sr-only", className)}
  />
)

const Root = ({
  className,
  children,
  ...props
}: PropsWithChildren<ClassNameProp & RefProp<HTMLUListElement>>) => (
  <ul {...props} className={cn("space-y-1", className)}>
    {children}
  </ul>
)

export const List = {
  Root,
  Item,
  Label,
  Action,
}
