import { forwardRef, PropsWithChildren } from "react"

import { ClassNameProp, IconProp } from "types/base-props"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Button } from "../button"
import { Icon } from "../icon"
import { IconButton, IconButtonProps } from "../icon-button"

export interface ListItemProps extends ClassNameProp {
  active?: boolean
}

const Item = forwardRef<HTMLLIElement, PropsWithChildren<ListItemProps>>(
  ({ className, active, children, ...props }, ref) => (
    <li
      {...props}
      ref={ref}
      className={cn(
        hstack({}),
        active ? "border-highlight/50" : "border-text-gentle/10",
        "bgl-base-b/10 hover:bgl-layer-w/5 h-10 list-none rounded-sm border [&>*]:h-full [&>*]:rounded-none [&>:first-child]:rounded-l-sm [&>:last-child]:rounded-e-sm",
        className
      )}
    >
      {children}
    </li>
  )
)
Item.displayName = "List.Item"

export interface ListItemLabelProps extends ClassNameProp, IconProp {
  onClick?: () => void
  to?: RoutePath
}

const Label = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ListItemLabelProps>
>(({ className, children, icon, ...props }, ref) => {
  return (
    <Button
      {...props}
      ref={ref}
      className={cn(
        hstack({ justify: "start", align: "center" }),
        "flex-1 truncate",
        className
      )}
    >
      {icon && <Icon icon={icon} className="-ml-1 mr-2" />}
      <span className="truncate">{children}</span>
    </Button>
  )
})
Label.displayName = "List.Label"

const Action = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, ...props }, ref) => (
    <IconButton
      {...props}
      ref={ref}
      hideTitle
      look="flat"
      className={cn("[*:not(:hover):not(:focus-within)>&]:sr-only", className)}
    />
  )
)
Action.displayName = "List.Action"

const Root = forwardRef<HTMLUListElement, PropsWithChildren<ClassNameProp>>(
  ({ className, children, ...props }, ref) => (
    <ul {...props} ref={ref} className={cn("space-y-1", className)}>
      {children}
    </ul>
  )
)
Root.displayName = "List.Root"

export const List = {
  Root,
  Item,
  Label,
  Action,
}
