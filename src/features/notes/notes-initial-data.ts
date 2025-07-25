import type { Note } from "./notes-data"

const text = `
# Markdown Cheatsheet

Gridwid allows you to use markdown in some places.
Here, you can find some examples on how to use markdown, to improve the structure of your notes.

## Inline Features

This is a paragraph with **bold text**, *italicized text*, ~~strikethrough text~~, and \`inline code\`.

You can also create [labeled links](https://commonmark.org) or just place urls like https://commonmark.org.

Additionally, you can reference existing notes by using their id: #md-sheet

---

## Lists

- unordered list
- unordered list
- unordered list

1. ordered list
1. ordered list
1. ordered list

- [x] task list
- [ ] task list
- [ ] task list

---

## Blockquotes

> This is a blockquote.
>
> It can span multiple lines.

---

## Tables

| Feature       | Description            | Supported |
|---------------|------------------------|-----------|
| Task Lists    | Interactive checkboxes | ✅         |
| Tables        | Organize data          | ✅         |
| Strikethrough | Cross out text         | ✅         |

---

## Code blocks

Code block with JavaScript syntax:

\`\`\`js
function someFunction() {
  console.log("Hello, world!")
}
\`\`\`

Code block with highlighted lines and line numbers:

\`\`\`ts {2,6-7,12} showLineNumbers
function createDebounce(delay: number) {
  let timeout: number | null = null

  const clear = () => {
    if (!timeout) return
    clearTimeout(timeout)
    timeout = null
  }

  const set = (fn: () => void) => {
    clear()
    timeout = window.setTimeout(fn, delay)
  }

  return Object.assign(set, { clear })
}
\`\`\`
`

export const notesInitialData: Note = {
  id: "md-sheet",
  title: "Markdown Cheatsheet",
  locked: false,
  createdAt: Date.now(),
  text: text.trim(),
}
