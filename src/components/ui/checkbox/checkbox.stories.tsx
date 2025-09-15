import { PropsWithChildren, useReducer, useState } from "react"

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

interface CheckboxState {
  id: string
  checked: boolean
  label: string
}
export const Editor: StoryObj<typeof CheckboxEditor> = {
  args: {
    onBlur: action("onBlur"),
    onFocus: action("onFocus"),
    onLabelChange: action("onLabelChange"),
  },
  render: args => {
    const [checkboxes, update] = useReducer(
      (state: CheckboxState[], data: Partial<CheckboxState>) =>
        state.map(item => (item.id !== data.id ? item : { ...item, ...data })),
      [
        { id: "1", label: "Dogs are friendly", checked: true },
        { id: "2", label: "Cats are cute", checked: false },
        { id: "3", label: "Ducks do quack", checked: false },
      ]
    )
    return (
      <StoryWrapper>
        {checkboxes.map(({ id, label, checked }) => (
          <CheckboxEditor
            key={id}
            {...args}
            placeholder="Start typing..."
            checked={checked}
            onCheckedChange={checked => update({ id, checked })}
            label={label}
            onLabelChange={label => update({ id, label })}
          />
        ))}

        <div className="pt-2 text-sm">For reference:</div>
        <Checkbox
          checked={!!checkboxes.at(-1)?.checked}
          label={checkboxes.at(-1)?.label}
          onCheckedChange={checked =>
            update({ id: checkboxes.at(-1)?.id, checked })
          }
        />
      </StoryWrapper>
    )
  },
}
