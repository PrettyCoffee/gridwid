import { faker } from "@faker-js/faker"
import { GripHorizontal, SquarePen, Trash } from "lucide-react"

import { argType, Meta, StoryObj } from "lib/storybook"

import { List, ListItemProps } from "./list"
import { IconButton } from "../icon-button"

faker.seed(1337)

const meta: Meta<typeof List.Item> = {
  title: "Primitives/List",
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

const Item = (props: ListItemProps) => (
  <List.Item {...props}>
    <IconButton
      icon={GripHorizontal}
      title="Re-order"
      hideTitle
      className="cursor-grab active:cursor-grabbing"
    />
    <List.Label>{faker.lorem.words({ min: 2, max: 3 })}</List.Label>
    <List.Action icon={SquarePen} title="Edit" />
    <List.Action icon={Trash} title="Delete" />
  </List.Item>
)

export const Default: Story = {
  render: args => (
    <List.Root className="max-w-64">
      <Item {...args} />
      <Item {...args} active />
    </List.Root>
  ),
}
