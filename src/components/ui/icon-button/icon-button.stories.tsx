import { Cat, Dog, Turtle } from "lucide-react"
import { Fragment } from "react"

import { argType, Meta, StoryObj } from "lib/storybook"

import { IconButton, IconButtonProps } from "./icon-button"

const meta: Meta<typeof IconButton> = {
  title: "Buttons/IconButton",
  component: IconButton,
  argTypes: {
    title: argType.string(),
    size: argType.enum(),
    look: argType.enum(),
    active: argType.boolean(),
    filled: argType.boolean(),
    disabled: argType.boolean(),

    onBlur: argType.callback(),
    onClick: argType.callback(),
    onFocus: argType.callback(),
  },
  args: {
    icon: Cat,
    title: "*click*",
    size: "md",
    look: "flat",
    active: false,
    filled: false,
  },
}

export default meta

type Story = StoryObj<typeof IconButton>

const kinds = ["key", "ghost", "flat", "destructive"] as const

const AllKinds = (props: IconButtonProps) => (
  <div className="inline-grid grid-cols-[auto_auto_auto_auto_auto] items-center gap-1">
    {kinds.map(look => (
      <Fragment key={look}>
        <span className="mr-2">{look}:</span>
        <IconButton {...props} title="Default" look={look} icon={Cat} />
        <IconButton {...props} title="Active" look={look} icon={Dog} active />
        <IconButton
          {...props}
          title="Disabled"
          look={look}
          icon={Turtle}
          disabled
        />
        <IconButton {...props} title="Filled" look={look} icon={Cat} filled />
      </Fragment>
    ))}
  </div>
)

export const Default: Story = {
  render: AllKinds,
}
export const Small: Story = {
  args: { size: "sm" },
  render: AllKinds,
}
