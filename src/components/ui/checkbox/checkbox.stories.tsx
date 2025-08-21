import { PropsWithChildren, useState } from "react"

import { faker } from "@faker-js/faker"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { Checkbox, CheckboxEditor, CheckboxProps } from "./checkbox"

faker.seed(1337)

const meta: Meta<typeof Checkbox> = {
  title: "UI/Inputs/Checkbox",
  component: Checkbox,
  argTypes: {
    label: argType.string(),
    checked: argType.enum("radio", {
      true: true,
      false: false,
      indeterminate: "indeterminate",
    }),
    onCheckedChange: argType.callback(),
  },
  args: {
    label: "I like ducks and ducks like me!",
    checked: false,
    onCheckedChange: action("onCheckedChange"),
  },
}

export default meta

type Story = StoryObj<typeof Checkbox>

const StoryWrapper = ({ children }: PropsWithChildren) => (
  <div className="max-w-96 space-y-1">{children}</div>
)

const ControlledCheckbox = ({
  checked,
  onCheckedChange,
  ...args
}: CheckboxProps) => {
  const [state, setState] = useState(checked)
  return (
    <Checkbox
      {...args}
      checked={state}
      onCheckedChange={checked => {
        setState(checked)
        onCheckedChange(checked)
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

export const MultiLineLabel: Story = {
  args: {
    label: faker.lorem.paragraphs(1),
  },
  render: args => (
    <StoryWrapper>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked="indeterminate" />
      <ControlledCheckbox {...args} checked={false} />
    </StoryWrapper>
  ),
}

export const BoxOnly: Story = {
  args: {
    label: undefined,
  },
  render: args => (
    <StoryWrapper>
      <ControlledCheckbox {...args} checked />
      <ControlledCheckbox {...args} checked="indeterminate" />
      <ControlledCheckbox {...args} checked={false} />
    </StoryWrapper>
  ),
}

export const Editor: Story = {
  args: {},
  render: args => {
    const [label, setLabel] = useState("Editable label")
    const [checked, setChecked] = useState(false)
    return (
      <StoryWrapper>
        <Checkbox
          checked={checked}
          label={label}
          onCheckedChange={setChecked}
        />
        <CheckboxEditor
          {...args}
          placeholder="Start typing..."
          checked={checked}
          onCheckedChange={setChecked}
          label={label}
          onLabelChange={setLabel}
        />
      </StoryWrapper>
    )
  },
}
