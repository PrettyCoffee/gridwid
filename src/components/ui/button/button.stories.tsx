import { Turtle } from "lucide-react"
import { Fragment } from "react"

import { argType, Meta, StoryObj } from "lib/storybook"

import { Button, ButtonProps } from "./button"

const meta: Meta<typeof Button> = {
  title: "Buttons/Button",
  component: Button,
  argTypes: {
    icon: argType.disabled(),
    active: argType.boolean(),
    to: argType.string(),
    isLoading: argType.boolean(),
    look: argType.enum(),
    size: argType.enum(),
    disabled: argType.boolean(),

    onBlur: argType.callback(),
    onFocus: argType.callback(),
    onClick: argType.callback(),
  },
  args: {
    size: "md",
    isLoading: false,
    look: "flat",
    active: false,
    to: "",
  },
}

export default meta
type Story = StoryObj<typeof Button>

const kinds = ["key", "ghost", "flat", "link", "destructive"] as const

const AllKinds = ({ to, ...args }: ButtonProps) => {
  const props = { ...args, to: to || undefined }
  return (
    <div className="inline-grid grid-cols-[auto_auto_auto_auto_auto_auto] items-center gap-1">
      {kinds.map(look => (
        <Fragment key={look}>
          <span className="mr-2">{look}:</span>
          <Button {...props} look={look}>
            Default
          </Button>
          <Button {...props} look={look} isLoading>
            Loading
          </Button>
          <Button {...props} look={look} icon={Turtle}>
            Turtle
          </Button>
          <Button {...props} look={look} active>
            Active
          </Button>
          <Button {...props} look={look} disabled>
            Disabled
          </Button>
        </Fragment>
      ))}
    </div>
  )
}

export const Default: Story = {
  args: {},
  render: AllKinds,
}

export const Small: Story = {
  args: { size: "sm" },
  render: AllKinds,
}
