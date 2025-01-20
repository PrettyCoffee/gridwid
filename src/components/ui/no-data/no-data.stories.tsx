import { argType, Meta, StoryObj } from "lib/storybook"

import { NoData } from "./no-data"
import { Button } from "../button"

const meta: Meta<typeof NoData> = {
  title: "Feedback/NoData",
  component: NoData,
  argTypes: {
    label: argType.string(),
  },
  args: {
    label: "There is no data to be found here. Create some to get started!",
  },
}

export default meta

type Story = StoryObj<typeof NoData>

export const Default: Story = {}

export const Buttons: Story = {
  render: args => (
    <NoData {...args}>
      <Button look="ghost">Click me!</Button>
      <Button look="key">Click me!</Button>
    </NoData>
  ),
}
