import { useMemo, useState } from "react"

import { Note, mockNotes } from "data/notes"
import { action, argType, Meta, StoryObj } from "lib/storybook"

import { NotesList } from "./notes-list"

const notes = mockNotes(5)

const StoryWithState: typeof NotesList = ({
  notes: initialNotes,
  filter: initialFilter,
  onSort,
  onDelete,
  onFilterChange,
  ...args
}) => {
  const [notes, setNotes] = useState(initialNotes)
  const [filter, setFilter] = useState(initialFilter)

  const filteredNotes = useMemo(
    () =>
      notes.filter(
        note =>
          !filter || note.title.toLowerCase().includes(filter.toLowerCase())
      ),
    [filter, notes]
  )

  const handleSort = (notes: Note[]) => {
    onSort(notes)
    setNotes(notes)
  }

  const handleDelete = (id: string) => {
    onDelete(id)
    setNotes(list => list.filter(note => note.id !== id))
  }

  const handleFilterChange = (value: string) => {
    onFilterChange(value)
    setFilter(value)
  }

  return (
    <NotesList
      {...args}
      notes={filteredNotes}
      filter={filter}
      onSort={handleSort}
      onFilterChange={handleFilterChange}
      onDelete={handleDelete}
    />
  )
}

const meta: Meta<typeof NotesList> = {
  title: "Features/Notes/NotesList",
  component: NotesList,
  argTypes: {
    notes: argType.disabled(),
    filter: argType.string(),
    activeNoteId: argType.string(),
    onDelete: argType.callback(),
    onFilterChange: argType.callback(),
    onSort: argType.callback(),
  },
  args: {
    notes,
    filter: "",
    activeNoteId: notes[1]?.id,
    onDelete: action("onDelete"),
    onFilterChange: action("onFilterChange"),
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
