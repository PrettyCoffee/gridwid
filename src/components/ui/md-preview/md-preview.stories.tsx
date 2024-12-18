import { argType, Meta, StoryObj } from "lib/storybook"

import { MDPreview } from "./md-preview"

const meta: Meta<typeof MDPreview> = {
  title: "Primitives/MDPreview",
  component: MDPreview,
  argTypes: {
    value: argType.string,
  },
  args: {
    value: "",
  },
}

export default meta

type Story = StoryObj<typeof MDPreview>

const commonMarkTest = `
# CommonMark Features

This is a paragraph with **bold text**, *italicized text*, and \`inline code\`.

---

## Lists

### Unordered list:

- Item 1
- Item 2
  - Sub-item 2.1
  - Sub-item 2.2

### Ordered list:

1. First item
2. Second item
   1. Sub-item 2.1
   2. Sub-item 2.2

---

## Links and Images

This is a [link to CommonMark](https://commonmark.org).

![CommonMark Logo](https://commonmark.org/help/images/favicon.png)

---

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.
`

export const CommonMark: Story = {
  args: { value: commonMarkTest },
}

const githubTest = `
# GFM Features

~~Strikethrough~~ is now supported and auto links like https://github.com, www.github.com or example@github.com.

At the bottom you will also find a Footnote[^1].
[^1]: Footnote mentioned at the top.

---

## Task Lists

- [x] Write the markdown example
- [ ] Submit the example

---

## Tables

| Feature       | Description            | Supported |
|---------------|------------------------|-----------|
| Task Lists    | Interactive checkboxes | ✅         |
| Tables        | Organize data          | ✅         |
| Strikethrough | Cross out text         | ✅         |

---
`

export const GFM: Story = {
  args: { value: githubTest },
}

const codeBlocksTest = `
# Code Blocks Features

## Indented Code

    function someFunction() {
      console.log("Hello, world!")
    }
 
---

## Fenced code with syntax highlighting

\`\`\`js
function someFunction() {
  console.log("Hello, world!")
}
\`\`\`

---

## Highlighted lines and diffs

\`\`\`js {2}
function someFunction() {
  console.log("Hello, world!")
}
\`\`\`

\`\`\`diff
--- some-function.js 2024-12-16 11:43:41 +0200
+++ /Users/foo/Desktop/some-function.js 2024-12-31 11:28:08 +0200
@@ -2 +2 @@
function someFunction() {
-  console.log("Helo, world!")
+  console.log("Hello, world!")
}
\`\`\`
`

export const CodeBlocks: Story = {
  args: { value: codeBlocksTest },
}

const mathTest = `
# Katex Features

## Inline math ($)

Partial correlation (pcor):
$ r_{AB \\backslash Z} = \\frac{r_{AB}-(r_{AZ})(r_{BZ})}{\\sqrt{1-r_{AZ}^2} \\sqrt{1-r_{BZ}^2}} $

---

## Math block ($$)

Binomial distribution:
$$
p(T | n, \\mu) = {n \\choose T} \\cdot \\mu^T \\cdot (1-\\mu)^{n-T}
$$
`

export const Math: Story = {
  args: { value: mathTest },
}
