import { argType, Meta, StoryObj } from "lib/storybook"

import { MDPreview } from "./md-preview"

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

\`\`\`js
function someFunction() {
  console.log("Hello, world!")
}
\`\`\`
`

const meta: Meta<typeof MDPreview> = {
  title: "Primitives/MDPreview",
  component: MDPreview,
  argTypes: {
    value: argType.string,
  },
  args: {
    value: markdown,
  },
}

export default meta

type Story = StoryObj<typeof MDPreview>

export const Default: Story = {
  args: {},
}
