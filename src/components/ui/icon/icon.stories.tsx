import { Cat } from "lucide-react"

import { argType, Meta, StoryObj } from "lib/storybook"

import { Icon } from "./icon"

const meta: Meta<typeof Icon> = {
  title: "UI/Primitives/Icon",
  component: Icon,
  argTypes: {
    icon: argType.disabled(),
    strokeWidth: argType.range({ min: 0.5, max: 5, step: 0.5 }),
    color: argType.enum(),
    filled: argType.boolean(),
    size: argType.enum(),
  },
  args: {
    icon: Cat,
  },
}

export default meta

type Story = StoryObj<typeof Icon>

export const Default: Story = {
  name: "Icon",
}
