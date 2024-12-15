import { Cat, Dog, Turtle } from "lucide-react"
import { useState } from "react"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { StateSwitch, StateSwitchGroupProps } from "./state-switch"

const meta: Meta<typeof StateSwitch.Group> = {
  title: "Buttons/StateSwitch",
  component: StateSwitch.Group,
  argTypes: {
    size: argType.enum("radio", ["md", "sm"]),
    current: argType.disabled(),
    onChange: argType.callback(),
  },
  args: {
    size: "md",
    current: "cat",
    onChange: action("onChange"),
  },
}

export default meta

type Story = StoryObj<typeof StateSwitch.Group>

const ControlledStateSwitch = (args: StateSwitchGroupProps) => {
  const [current, setCurrent] = useState("cat")

  const handleChange = (value: string) => {
    setCurrent(value)
    action("onChange")(value)
  }

  return (
    <StateSwitch.Group {...args} current={current} onChange={handleChange}>
      <StateSwitch.Option label={"Dog"} value={"cat"} icon={Cat} />
      <StateSwitch.Option label={"Cat"} value={"dog"} icon={Dog} />
      <StateSwitch.Option label={"Turtle"} value={"turtle"} icon={Turtle} />
    </StateSwitch.Group>
  )
}

export const Default: Story = {
  args: {},
  render: ControlledStateSwitch,
}

export const Small: Story = {
  args: { size: "sm" },
  render: ControlledStateSwitch,
}
