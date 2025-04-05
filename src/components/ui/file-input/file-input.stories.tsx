import { argType, Meta, StoryObj } from "lib/storybook"

import { FileInput } from "./file-input"
import { vstack } from "../../../utils/styles"

const meta: Meta<typeof FileInput> = {
  title: "Inputs/FileInput",
  component: FileInput,
  argTypes: {
    label: argType.string(),
    alert: argType.disabled(),
    onChange: argType.callback(),
  },
  args: {
    label: "Upload file",
  },
}

export default meta

type Story = StoryObj<typeof FileInput>

export const Default: Story = {}
export const Alerts: Story = {
  render: args => (
    <div className={vstack({ gap: 4, align: "start" })}>
      <FileInput
        {...args}
        alert={{ kind: "info", text: "FYI: You can upload stuff here!" }}
      />
      <FileInput
        {...args}
        alert={{ kind: "success", text: "Yay, you uploaded it :)" }}
      />
      <FileInput
        {...args}
        alert={{ kind: "error", text: "Oof, something did not work out :(" }}
      />
      <FileInput
        {...args}
        alert={{ kind: "warn", text: "Thats a warning, you better watch out!" }}
      />
    </div>
  ),
}
