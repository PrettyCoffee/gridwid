import { useState } from "react"

import { action, argType, Meta, StoryObj } from "lib/storybook"

import { CodeEditor, CodeEditorProps } from "./code-editor"

const meta: Meta<typeof CodeEditor> = {
  title: "Inputs/CodeEditor",
  component: CodeEditor,
  argTypes: {
    value: argType.disabled(),
    language: argType.string(),
    rehypePlugins: argType.disabled(),
    showLineNumbers: argType.boolean(),
    hideShortcuts: argType.boolean(),

    id: argType.string(),
    placeholder: argType.string(),
    style: argType.disabled(),
    readOnly: argType.boolean(),
    disabled: argType.boolean(),

    onChange: argType.callback(),
    onBlur: argType.callback(),
    onFocus: argType.callback(),
    onSave: argType.callback(),
  },
  args: {
    id: "",
    value: "",
    disabled: false,
    readOnly: false,
    showLineNumbers: false,
    hideShortcuts: false,
    language: "markdown",
    placeholder: "Type some demo code here...",
    onChange: action("onChange"),
    onSave: action("onSave"),
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

\`\`\`diff
--- bar.yml 2014-12-16 11:43:41 +0800
+++ /Users/foo/Desktop/bar.yml 2014-12-31 11:28:08 +0800
@@ -4,5 +4,5 @@
project:
  sources: "src/*.cpp"
  headers: "src/*.h"
-  qt: core
+  qt: core gui
public_headers: "src/*.h"
\`\`\`

[thats a link](yup://thats-a-link.clearly)

1. This is a numbered list item
2. This is another numbered list item

- This is a list item
- This is another list item

- [ ] This is a checkbox
- [x] This is another checkbox

> This is a quote

| Heading | Heading |
|---------|---------|
| Content | Content |
| Content | Content |
| Content | Content |
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
  content: "bliblablub";
  color: pink;
  background-color: black;
  color: var(--some-variable);
  height: calc(1rem + 100vh);
}

@media screen and (min-width: 768px) { /* ... */ }
`
export const CSS: Story = {
  args: {
    value: cssCode,
    language: "css",
  },
  render: ControlledCodeEditor,
}

const jsxCode = `
interface InterfaceType extends SomeProp {
  props: InterfaceType
  value: string
  boolValue: true
}

const REGEX = /some[^abc]*\\S\\.+/ig
REGEX.exec("some-x")

const num = 42
export const CONSTANT_NUM = 123213

/** Something something yada uada
 *  Lorem ipsum
 **/
export const SomeComponent = ({
  props,
  value,
  boolValue
}: InterfaceType) => {
  const text = \`Something \${value}\`;
}

  const memed = useMemo(() => {
    const hmmmm = value + String(boolValue)
    if (!hmmmm) {
      throw new Error("HAH!!!")
    }
    return hmmmm
  }, [value, languageClass, plugins])

  return (
    <div
      href="httpstest.de"
      className={cn(languageClass, className, "other-class")}
      onClick={({ target }) => console.log(target)}
    >
      This is an &amp; symbol
    </div>
  )
}
`

export const JSX: Story = {
  args: {
    value: jsxCode,
    language: "jsx",
    showLineNumbers: true,
  },
  render: ControlledCodeEditor,
}
