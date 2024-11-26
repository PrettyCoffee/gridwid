import { Clock } from "lucide-react"
import { useState } from "react"

import { action, argType, Meta, StoryObj } from "lib/storybook"
import { formatTime } from "utils/format"

import { Checkbox, CheckboxProps } from "./checkbox"
import { Icon } from "../icon"

const meta: Meta<typeof Checkbox> = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  argTypes: {
    label: argType.string(),
    subLine: argType.string(),
    checked: argType.enum("radio", {
      true: true,
      false: false,
      indeterminate: "indeterminate",
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

type Story = StoryObj<typeof Checkbox>

const SubLine = () => (
  <>
    <Icon
      icon={Clock}
      strokeWidth={3}
      color="current"
      size="xs"
      className="mr-1"
    />
    {formatTime(new Date())}
  </>
)

const ControlledCheckbox = ({ checked, onChange, ...args }: CheckboxProps) => {
  const [state, setState] = useState(checked)
  return (
    <Checkbox
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
  args: {},
  render: args => (
    <div>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked="indeterminate" />
      <ControlledCheckbox {...args} checked={false} />
    </div>
  ),
}

export const WithSubLine: Story = {
  args: {
    subLine: <SubLine />,
  },
  render: args => (
    <div>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked="indeterminate" />
      <ControlledCheckbox {...args} checked={false} />
    </div>
  ),
}
