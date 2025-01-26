import { useState } from "react"

import { argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { TextInput, TextInputProps } from "./text-input"

const meta: Meta<typeof TextInput> = {
  title: "Inputs/TextInput",
  component: TextInput,
  argTypes: {
    type: argType.enum(),
    value: argType.string(),
    placeholder: argType.string(),
    alert: argType.disabled(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
    onKeyDown: argType.callback(),
  },
  args: {
    type: "text",
    placeholder: "Type something",
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof TextInput>

const ControlledStory = ({
  value: initialValue,
  onChange,
  ...props
}: TextInputProps) => {
  const [value, setValue] = useState(initialValue)
  return (
    <TextInput
      {...props}
      value={value}
      onChange={value => {
        onChange?.(value)
        setValue(value)
      }}
    />
  )
}

export const Default: Story = { render: ControlledStory }

export const Alerts: Story = {
  render: args => (
    <div className={cn(vstack({ gap: 2 }), "w-64")}>
      <ControlledStory {...args} alert={{ kind: "info", text: "INFO!!!" }} />
      <ControlledStory
        {...args}
        alert={{ kind: "success", text: "SUCCESS!!!" }}
      />
      <ControlledStory {...args} alert={{ kind: "warn", text: "WARN!!!" }} />
      <ControlledStory {...args} alert={{ kind: "error", text: "ERROR!!!" }} />
    </div>
  ),
}

export const Search: Story = {
  args: { type: "search" },
  render: args => (
    <div className={cn(vstack({ gap: 2 }), "w-64")}>
      <ControlledStory {...args} />
      <ControlledStory {...args} alert={{ kind: "warn", text: "WARN!!!" }} />
    </div>
  ),
}
