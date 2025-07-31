import { argType, Meta, StoryObj } from "lib/storybook"
import { createRange } from "utils/create-range"

import { Popover } from "./popover"
import { Button } from "../button"
import { List } from "../list"

const meta: Meta<typeof Popover.Root> = {
  title: "Overlay/Popover",
  component: Popover.Root,
  argTypes: {
    defaultOpen: argType.boolean(),
    open: argType.boolean(),
    modal: argType.boolean(),
    onOpenChange: argType.callback(),
  },
  args: {
    defaultOpen: true,
    modal: false,
  },
}

export default meta

type Story = StoryObj<typeof Popover.Root>

export const Default: Story = {
  args: {},
  render: args => (
    <Popover.Root {...args}>
      <Popover.Trigger asChild>
        <Button>Click me</Button>
      </Popover.Trigger>

      <Popover.Content align="start" className="min-w-48">
        <List.Root>
          {createRange(0, 4).map(value => (
            <List.Item key={value}>
              <Popover.Close asChild>
                <List.Label label={"Item " + value} />
              </Popover.Close>
            </List.Item>
          ))}
        </List.Root>
      </Popover.Content>
    </Popover.Root>
  ),
}
