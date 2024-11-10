import { forwardRef, PropsWithChildren } from "react"

import { ClassNameProp } from "types/base-props"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Button } from "../button"
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
        "bgl-base-b/10 hover:bgl-layer-w/5 h-10 list-none rounded border [&>*]:h-full [&>*]:rounded-none [&>:first-child]:rounded-l [&>:last-child]:rounded-e",
        className
      )}
    >
      {children}
    </li>
  )
)
Item.displayName = "List.Item"

export interface ListItemLabelProps extends ClassNameProp {
  onClick?: () => void
  to?: RoutePath
}

const Label = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<ListItemLabelProps>
>(({ className, children, ...props }, ref) => {
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
      <span className="truncate">{children}</span>
    </Button>
  )
})

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
Action.displayName = "List.Root"

export const List = {
  Root,
  Item,
  Label,
  Action,
}
