import { Icon, IconProp, IconProps } from "./Icon"
import { IconButton, IconButtonProps } from "./IconButton"
import {
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface MenuItem extends Partial<IconProp> {
  label: string
  iconColor?: IconProps["color"]
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

interface MenuItemGroup {
  label: string
  items: MenuItem[]
}

interface MenuButtonProps
  extends Pick<IconButtonProps, "icon" | "title" | "titleSide" | "className"> {
  items: MenuItem[] | MenuItemGroup[]
}

const isItemGroup = (item: MenuItem | MenuItemGroup): item is MenuItemGroup =>
  "items" in item

const MenuButtonItem = ({ icon, iconColor, label, onClick }: MenuItem) => (
  <DropdownMenuItem onClick={onClick} className="flex gap-2">
    {icon && <Icon icon={icon} color={iconColor} size="sm" />}
    {label}
  </DropdownMenuItem>
)

const MenuButtonGroup = ({
  label,
  items,
  addSeparator,
}: MenuItemGroup & { addSeparator: boolean }) => (
  <>
    {addSeparator && <DropdownMenuSeparator />}
    <DropdownMenuLabel>{label}</DropdownMenuLabel>
    <DropdownMenuGroup>
      {items.map(item => (
        <MenuButtonItem key={item.label} {...item} />
      ))}
    </DropdownMenuGroup>
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
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <IconButton {...iconButtonProps} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <MenuButtonItems items={items} />
    </DropdownMenuContent>
  </DropdownMenu>
)
