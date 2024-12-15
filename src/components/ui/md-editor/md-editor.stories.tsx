import { useState } from "react"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { MDEditor, MDEditorProps } from "./md-editor"

const markdown = `
# Hello World!

## This is markdown

**This is bold text**
*This is italic text*

1. This is a numbered list item
2. This is another numbered list item

- This is a list item
- This is another list item

- [ ] This is a checkbox
- [x] This is another checkbox

> This is a quote
`

const meta: Meta<typeof MDEditor> = {
  title: "Inputs/MDEditor",
  component: MDEditor,
  argTypes: {
    value: argType.string(),
    placeholder: argType.string(),
    id: argType.string(),
    inputClassName: argType.string(),
    previewClassName: argType.string(),
    disabled: argType.boolean(),
    readOnly: argType.boolean(),

    onChange: argType.callback(),
    onSave: argType.callback(),
    onFocus: argType.callback(),
    onBlur: argType.callback(),
  },
  args: {
    value: markdown.trim(),
    disabled: false,
    readOnly: false,
    placeholder: "Insert markdown here...",

    onChange: action("onChange"),
    onSave: action("onSave"),
    onFocus: action("onFocus"),
    onBlur: action("onBlur"),
  },
}

export default meta

type Story = StoryObj<typeof MDEditor>

const ControlledMdEditor = ({
  value: initialValue,
  onChange,
  ...props
}: MDEditorProps) => {
  const [value, setValue] = useState(initialValue)
  const handleChange = (value: string) => {
    setValue(value)
    onChange(value)
  }
  return <MDEditor {...props} value={value} onChange={handleChange} />
}

export const Default: Story = {
  args: {},
  render: args => <ControlledMdEditor {...args} className={"max-h-96"} />,
}
