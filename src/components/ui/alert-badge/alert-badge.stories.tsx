import { argType, Meta, StoryObj } from "lib/storybook"
import { AlertKind } from "types/base-props"

import { AlertBadge } from "./alert-badge"
import { Button } from "../button"

const meta: Meta<typeof AlertBadge> = {
  title: "UI/Feedback/AlertBadge",
  component: AlertBadge,
  argTypes: {
    kind: argType.enum(),
    hidden: argType.boolean(),
  },
  args: {
    kind: "info",
    hidden: false,
  },
}

export default meta

type Story = StoryObj<typeof AlertBadge>

const kinds: AlertKind[] = ["error", "info", "success", "warn"]

export const Default: Story = {
  name: "AlertBadge",
  render: args => (
    <>
      {kinds.map(kind => (
        <Button key={kind}>
          {kind}
          <AlertBadge {...args} kind={kind} />
        </Button>
      ))}
    </>
  ),
}
