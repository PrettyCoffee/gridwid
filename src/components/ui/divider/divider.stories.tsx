import { argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { Divider } from "./divider"

const meta: Meta<typeof Divider> = {
  title: "UI/Primitives/Divider",
  component: Divider,
  argTypes: {
    orientation: argType.enum(),
    color: argType.enum(),
  },
  args: {
    orientation: "horizontal",
    color: "default",
  },
}

export default meta

type Story = StoryObj<typeof Divider>

export const Default: Story = {
  render: args => (
    <>
      <Divider {...args} orientation="horizontal" />
      <div className={cn(hstack({ justify: "between" }), "my-2 h-12 px-2")}>
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
        <Divider {...args} orientation="vertical" />
      </div>
      <Divider {...args} orientation="horizontal" />
    </>
  ),
}
