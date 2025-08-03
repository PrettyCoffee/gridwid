import { useState } from "react"

import { mockNotes } from "data/notes"
import { action, argType, Meta, StoryObj } from "lib/storybook"

import { NotesList } from "./notes-list"

const notes = mockNotes(5)

const StoryWithState: typeof NotesList = ({
  notes: initialNotes,
  onSort,
  onDelete,
  ...args
}) => {
  const [notes, setNotes] = useState(initialNotes)

  const handleSort: typeof onSort = (sort) => {
    onSort(sort)
    setNotes(sort(notes))
  }

  const handleDelete: typeof onDelete = (id: string) => {
    onDelete(id)
    setNotes(list => list.filter(note => note.id !== id))
  }

  return (
    <NotesList
      {...args}
      notes={notes}
      onSort={handleSort}
      onDelete={handleDelete}
    />
  )
}

const meta: Meta<typeof NotesList> = {
  title: "Features/Notes/NotesList",
  component: NotesList,
  argTypes: {
    notes: argType.disabled(),
    activeNoteId: argType.string(),
    group: argType.string(),
    disableSortable: argType.boolean(),
    onDelete: argType.callback(),
    onSort: argType.callback(),
  },
  args: {
    notes,
    group: "",
    activeNoteId: notes[1]?.id,
    disableSortable: false,
    onDelete: action("onDelete"),
    onSort: action("onSort"),
  },
  decorators: (Story, { args }) => (
    <div className="max-w-60">
      <Story {...args} />
    </div>
  ),
  render: args => <StoryWithState {...args} />,
}

export default meta

type Story = StoryObj<typeof NotesList>

export const Default: Story = {}
export const WithGroup: Story = { args: { group: "Some group" } }
