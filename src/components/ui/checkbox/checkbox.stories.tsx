import { faker } from "@faker-js/faker"
import { Clock } from "lucide-react"
import { PropsWithChildren, useState } from "react"

import { action, argType, Meta, StoryObj } from "lib/storybook"
import { formatTime } from "utils/format"

import { Checkbox, CheckboxProps } from "./checkbox"
import { Icon } from "../icon"

faker.seed(1334)

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

const StoryWrapper = ({ children }: PropsWithChildren) => (
  <div className="max-w-96 overflow-hidden">{children}</div>
)

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
    <StoryWrapper>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked="indeterminate" />
      <ControlledCheckbox {...args} checked={false} />
    </StoryWrapper>
  ),
}

export const WithSubLine: Story = {
  args: {
    subLine: <SubLine />,
  },
  render: args => (
    <StoryWrapper>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked="indeterminate" />
      <ControlledCheckbox {...args} checked={false} />
    </StoryWrapper>
  ),
}

export const MultiLineLabel: Story = {
  args: {
    label: faker.lorem.paragraphs(1),
  },
  render: args => (
    <StoryWrapper>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked={"indeterminate"} />
      <ControlledCheckbox {...args} checked={false} subLine={<SubLine />} />
    </StoryWrapper>
  ),
}

export const BoxOnly: Story = {
  args: {
    label: undefined,
    subLine: undefined,
  },
  render: args => (
    <StoryWrapper>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked={"indeterminate"} />
      <ControlledCheckbox {...args} checked={false} />
    </StoryWrapper>
  ),
}
