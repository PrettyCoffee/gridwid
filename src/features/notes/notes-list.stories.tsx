import { useMemo, useState } from "react"

import { faker } from "@faker-js/faker"

import { Note } from "data/notes"
import { action, argType, Meta, StoryObj } from "lib/storybook"

import { NotesList } from "./notes-list"

faker.seed(1337)

const recentDate = () =>
  faker.date.recent({ refDate: new Date("2025-01-01") }).valueOf()

let id = 0
const createNote = (): Note => ({
  id: (id++).toString(),
  createdAt: recentDate(),
  locked: faker.datatype.boolean({ probability: 0.3 }),
  text: faker.lorem.paragraph({ min: 1, max: 5 }),
  title: faker.lorem.words({ min: 1, max: 3 }),
  changedAt: faker.helpers.arrayElement([undefined, recentDate()]),
})

const notes = [
  createNote(),
  createNote(),
  createNote(),
  createNote(),
  createNote(),
]

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
