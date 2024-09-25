import { PropsWithChildren } from "react"

import { ClassNameProp } from "types/base-props"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Button } from "../button"
import { IconButton, IconButtonProps } from "../icon-button"

export interface ListItemProps extends ClassNameProp {
  active?: boolean
}

const Item = ({
  className,
  active,
  children,
}: PropsWithChildren<ListItemProps>) => (
  <li
    className={cn(
      hstack({}),
      active ? "border-text-highlight/50" : "border-text-gentle/10",
      "bgl-base-b/10 hover:bgl-layer-w/5 h-10 list-none rounded border [&>*]:rounded-none [&>:first-child]:rounded-l [&>:last-child]:rounded-e",
      className
    )}
  >
    {children}
  </li>
)

export interface ListItemLabelProps extends ClassNameProp {
  onClick?: () => void
  to?: RoutePath
}

const Label = ({
  className,
  children,
  ...props
}: PropsWithChildren<ListItemLabelProps>) => {
  return (
    <Button
      {...props}
      className={cn(
        hstack({ justify: "start", align: "center" }),
        "flex-1 truncate",
        className
      )}
    >
      <span className="truncate">{children}</span>
    </Button>
  )
}

const Action = ({ className, ...props }: IconButtonProps) => (
  <IconButton
    hideTitle
    look="flat"
    {...props}
    className={cn("[*:not(:hover):not(:focus-within)>&]:sr-only", className)}
  />
)

const Root = ({ className, children }: PropsWithChildren<ClassNameProp>) => (
  <ul className={cn("space-y-1", className)}>{children}</ul>
)

export const List = {
  Root,
  Item,
  Label,
  Action,
}
