import { faker } from "@faker-js/faker"
import { Circle, GripHorizontal, SquarePen, Trash } from "lucide-react"

import { argType, Meta, StoryObj } from "lib/storybook"

import { List, ListItemProps } from "./list"
import { IconProp } from "../../../types/base-props"
import { IconButton } from "../icon-button"

faker.seed(1337)

const meta: Meta<typeof List.Item> = {
  title: "UI/Primitives/List",
  component: List.Item,
  argTypes: {
    active: argType.boolean(),
  },
  args: {
    active: false,
  },
}

export default meta

type Story = StoryObj<typeof List.Item>

const Item = ({ icon, ...props }: ListItemProps & IconProp) => (
  <List.Item {...props}>
    <IconButton
      icon={GripHorizontal}
      title="Re-order"
      hideTitle
      className="cursor-grab active:cursor-grabbing"
    />
    <List.Label icon={icon} label={faker.lorem.words({ min: 2, max: 3 })} />
    <List.Action icon={SquarePen} title="Edit" />
    <List.Action icon={Trash} title="Delete" />
  </List.Item>
)

export const Default: Story = {
  render: args => (
    <List.Root className="max-w-64">
      <Item {...args} />
      <Item {...args} active />
      <Item {...args} icon={Circle} />
    </List.Root>
  ),
}
