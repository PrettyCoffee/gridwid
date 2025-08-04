import { argType, Meta, StoryObj } from "lib/storybook"

import { Spinner } from "./spinner"

const meta: Meta<typeof Spinner> = {
  title: "UI/Feedback/Spinner",
  component: Spinner,
  argTypes: {
    size: argType.enum(),
    color: argType.enum(),
    centered: argType.boolean(),
  },
  args: {
    size: "md",
    color: "default",
    centered: false,
  },
}

export default meta

type Story = StoryObj<typeof Spinner>

export const Default: Story = { name: "Spinner" }
