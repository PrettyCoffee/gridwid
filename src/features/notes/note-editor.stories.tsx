import { useState } from "react"

import { HashRouter } from "components/utility/hash-router"
import { mockNotes } from "data/notes"
import { action, argType, Meta, StoryObj } from "lib/storybook"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

import { NoteEditor } from "./note-editor"

const mockedNote = { ...mockNotes(1)[0]!, locked: false }

const StoryWithState: typeof NoteEditor = ({
  note: initialNote,
  onDelete,
  onSave,
}) => {
  const [note, setNote] = useState(initialNote)

  const handleDelete: typeof onDelete = noteId => {
    onDelete(noteId)
  }

  const handleSave: typeof onSave = (noteId, data) => {
    onSave(noteId, data)
    setNote((prev = mockedNote) => ({ ...prev, ...data }))
  }

  return <NoteEditor note={note} onDelete={handleDelete} onSave={handleSave} />
}

const meta: Meta<typeof NoteEditor> = {
  title: "Features/Notes/NoteEditor",
  component: NoteEditor,
  argTypes: {
    note: argType.disabled(),
    onDelete: argType.callback(),
    onSave: argType.callback(),
  },
  args: {
    note: mockedNote,
    onDelete: action("onDelete"),
    onSave: action("onSave"),
  },
  decorators: (Story, { args }) => (
    <HashRouter.Provider>
      <div className={cn(vstack(), "h-[calc(100vh-2rem)]")}>
        <Story {...args} />
      </div>
    </HashRouter.Provider>
  ),
  render: args => <StoryWithState {...args} />,
}

export default meta

type Story = StoryObj<typeof NoteEditor>

export const Default: Story = {}
export const Locked: Story = { args: { note: { ...mockedNote, locked: true } } }
export const NoNote: Story = { args: { note: undefined } }
