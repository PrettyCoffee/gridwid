import { Dispatch, MouseEventHandler } from "react"

import { cn } from "~/lib/utils"

import { Icon, IconProp } from "./Icon"
import { IconButton, IconButtonProps } from "./IconButton"
import { DropdownMenu } from "./ui/dropdown-menu"

export interface MenuItem extends Partial<IconProp> {
  label: string
  destructive?: boolean
  keepOpen?: boolean
  onClick?: () => void
  selectable?: {
    checked?: boolean
    onChange?: Dispatch<boolean>
  }
}

export interface MenuItemGroup {
  label: string
  items: MenuItem[]
}

interface MenuButtonProps
  extends Pick<
    IconButtonProps,
    "icon" | "title" | "titleSide" | "hideTitle" | "className"
  > {
  items: MenuItem[] | MenuItemGroup[]
}

const isItemGroup = (item: MenuItem | MenuItemGroup): item is MenuItemGroup =>
  "items" in item

const MenuButtonItem = ({
  icon,
  destructive,
  label,
  onClick,
  keepOpen,
  selectable,
}: MenuItem) => {
  // focus is hover here as well
  const className = cn(
    "flex gap-2",
    destructive && "hover:bg-error/10 focus:bg-error/10 active:bg-error/20"
  )
  const handleClick: MouseEventHandler<HTMLDivElement> = e => {
    if (keepOpen) e.preventDefault()
    onClick?.()
  }
  if (selectable) {
    return (
      <DropdownMenu.CheckboxItem
        // focus is hover here as well
        className={className}
        checked={selectable.checked}
        onClick={e => {
          handleClick(e)
          selectable.onChange?.(!selectable.checked)
        }}
      >
        {label}
      </DropdownMenu.CheckboxItem>
    )
  }
  return (
    <DropdownMenu.Item
      // focus is hover here as well
      className={className}
      onClick={handleClick}
    >
      {icon && (
        <Icon icon={icon} color={destructive ? "error" : "default"} size="sm" />
      )}
      {label}
    </DropdownMenu.Item>
  )
}

const MenuButtonGroup = ({
  label,
  items,
  addSeparator,
}: MenuItemGroup & { addSeparator: boolean }) => (
  <>
    {addSeparator && <DropdownMenu.Separator />}
    <DropdownMenu.Label className="text-xs text-muted-foreground">
      {label}
    </DropdownMenu.Label>
    <DropdownMenu.Group>
      {items.map(item => (
        <MenuButtonItem key={item.label} {...item} />
      ))}
    </DropdownMenu.Group>
  </>
)

const MenuButtonItems = ({ items }: Pick<MenuButtonProps, "items">) => (
  <>
    {items.map((item, index) =>
      isItemGroup(item) ? (
        <MenuButtonGroup key={item.label} addSeparator={index != 0} {...item} />
      ) : (
        <MenuButtonItem key={item.label} {...item} />
      )
    )}
  </>
)

export const MenuButton = ({ items, ...iconButtonProps }: MenuButtonProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger asChild>
      <IconButton {...iconButtonProps} />
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="end">
      <MenuButtonItems items={items} />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
)
