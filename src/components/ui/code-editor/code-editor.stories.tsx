import { useState } from "react"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { CodeEditor, CodeEditorProps } from "./code-editor"

const meta: Meta<typeof CodeEditor> = {
  title: "Primitives/CodeEditor",
  component: CodeEditor,
  argTypes: {
    value: argType.string,
    language: argType.string,
    rehypePlugins: argType.disabled(),
    "data-color-mode": argType.enum(),

    id: argType.string(),
    placeholder: argType.string,
    style: argType.disabled(),
    readOnly: argType.boolean(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onKeyDown: argType.callback(),
    onBlur: argType.callback(),
    onFocus: argType.callback(),
  },
  args: {
    value: "",
    language: "markdown",
    onChange: action("onChange"),
    onKeyDown: action("onKeyDown"),
    placeholder: "Type some markdown here...",
  },
}

export default meta

type Story = StoryObj<typeof CodeEditor>

const ControlledCodeEditor = ({
  value: initialValue,
  onChange,
  ...props
}: CodeEditorProps) => {
  const [value, setValue] = useState(initialValue.trim())
  const handleChange = (value: string) => {
    setValue(value)
    onChange(value)
  }
  return <CodeEditor {...props} value={value} onChange={handleChange} />
}

const markdownCode = `
# Hello World!

## This is markdown

**This is bold text**
*This is italic text*

\`\`\`css
.some-class {
  color: pink;
  background-color: black;
}
\`\`\`

1. This is a numbered list item
2. This is another numbered list item

- This is a list item
- This is another list item

- [ ] This is a checkbox
- [x] This is another checkbox

> This is a quote
`
export const Markdown: Story = {
  args: {
    value: markdownCode,
    language: "markdown",
  },
  render: ControlledCodeEditor,
}

const cssCode = `
.some-class {
  color: pink;
  background-color: black;
}
`
export const CSS: Story = {
  args: {
    value: cssCode,
    language: "css",
  },
  render: ControlledCodeEditor,
}

const jsxCode = `
/** This is an input component */
const Input = () => {
  const [value, setValue] = useState("")
  
  return (
    <input
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  )
}
`
export const JSX: Story = {
  args: {
    value: jsxCode,
    language: "jsx",
  },
  render: ControlledCodeEditor,
}
