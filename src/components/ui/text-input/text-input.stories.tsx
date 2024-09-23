import { argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { TextInput } from "./text-input"

const meta: Meta<typeof TextInput> = {
  title: "Inputs/TextInput",
  component: TextInput,
  argTypes: {
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
    placeholder: "Type something",
    disabled: false,
  },
}

export default meta

type Story = StoryObj<typeof TextInput>

export const Default: Story = {}

export const Alerts: Story = {
  render: args => (
    <div className={cn(vstack({ gap: 2 }), "w-64")}>
      <TextInput {...args} alert={{ kind: "info", text: "INFO!!!" }} />
      <TextInput {...args} alert={{ kind: "success", text: "SUCCESS!!!" }} />
      <TextInput {...args} alert={{ kind: "warn", text: "WARN!!!" }} />
      <TextInput {...args} alert={{ kind: "error", text: "ERROR!!!" }} />
    </div>
  ),
}
