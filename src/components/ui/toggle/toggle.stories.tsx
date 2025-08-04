import { PropsWithChildren, useState } from "react"

import { faker } from "@faker-js/faker"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { Toggle, ToggleProps } from "./toggle"

faker.seed(1337)

const meta: Meta<typeof Toggle> = {
  title: "UI/Inputs/Toggle",
  component: Toggle,
  argTypes: {
    label: argType.string(),
    checked: argType.enum("radio", {
      true: true,
      false: false,
    }),
    onChange: argType.callback(),
  },
  args: {
    label: "I like ducks and ducks like me!",
    checked: false,
    onChange: action("onChange"),
  },
}

export default meta

type Story = StoryObj<typeof Toggle>

const StoryWrapper = ({ children }: PropsWithChildren) => (
  <div className="max-w-96 overflow-hidden">{children}</div>
)

const ControlledToggle = ({ checked, onChange, ...args }: ToggleProps) => {
  const [state, setState] = useState(checked)
  return (
    <Toggle
      {...args}
      checked={state}
      onChange={checked => {
        setState(checked)
        onChange(checked)
      }}
    />
  )
}

export const Default: Story = {
  name: "Toggle",
  args: {},
  render: args => (
    <StoryWrapper>
      <ControlledToggle {...args} checked />
      <ControlledToggle {...args} checked={false} />
    </StoryWrapper>
  ),
}
