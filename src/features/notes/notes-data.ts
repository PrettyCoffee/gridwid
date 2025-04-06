import { createSelector, createSlice, localStorage } from "lib/yaasl"
import { getNextId } from "utils/get-next-id"

import { notesInitialData } from "./notes-initial-data"

export interface Note {
  id: string
  createdAt: number
  changedAt?: number
  title: string
  text: string
  locked: boolean
}

export const notesData = createSlice({
  name: "notes",
  defaultValue: [notesInitialData] as Note[],
  effects: [localStorage()],
  reducers: {
    add: (state, note: Omit<Note, "id" | "createdAt" | "locked">) => [
      ...state,
      { ...note, id: getNextId(), createdAt: Date.now(), locked: false },
    ],
    edit: (state, id: string, data: Partial<Omit<Note, "id">>) =>
      state.map(note =>
        note.id === id ? { ...note, ...data, changedAt: Date.now() } : note
      ),
    remove: (state, id: string) => state.filter(note => note.id !== id),
  },
})

interface NotesSearch {
  filter: string
}
export const notesSearchData = createSlice({
  name: "notes-filter",
  defaultValue: { filter: "" } satisfies NotesSearch as NotesSearch,
  reducers: {
    setFilter: (state, filter: string) => ({ ...state, filter }),
  },
})

const noteFilter = (note: Note, filterText: string) => {
  const title = note.title.toLowerCase()
  const text = note.text.toLowerCase()
  const filter = filterText.toLowerCase()
  return title.includes(filter) || text.includes(filter)
}

export const notesSearch = createSelector(
  [notesData, notesSearchData],
  (notes, { filter }) => notes.filter(note => noteFilter(note, filter))
)
