import { Fragment } from "react"

import { Cat, Dog, Turtle } from "lucide-react"

import { argType, Meta, StoryObj } from "lib/storybook"

import { IconButton, IconButtonProps } from "./icon-button"

const meta: Meta<typeof IconButton> = {
  title: "Buttons/IconButton",
  component: IconButton,
  argTypes: {
    icon: argType.disabled(),
    title: argType.string(),
    to: argType.string(),
    href: argType.string(),
    target: argType.enum(),
    size: argType.enum(),
    look: argType.enum(),
    active: argType.boolean(),
    filled: argType.boolean(),
    disabled: argType.boolean(),
    hideTitle: argType.boolean(),
    titleSide: argType.enum(),

    onBlur: argType.callback(),
    onClick: argType.callback(),
    onFocus: argType.callback(),

    style: argType.hidden(),
  },
  args: {
    icon: Cat,
    look: "flat",
    title: "*click*",
    titleSide: "top",
    size: "md",
    active: false,
    filled: false,
    hideTitle: false,
    disabled: false,
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
