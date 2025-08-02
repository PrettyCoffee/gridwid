import { z } from "zod"

import { createSelector, createSlice, indexedDb } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { getNextId } from "utils/get-next-id"

import { notesInitialData } from "./notes-initial-data"

export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  text: z.string(),
  changedAt: z.optional(z.number()),
  createdAt: z.number(),
  locked: z.boolean(),
})

// TODO: Delete migration
const legacyKey = "gridwid/notes"
const legacyValue = (() => {
  const value = window.localStorage.getItem(legacyKey)
  if (!value) return null
  try {
    const parsed = JSON.parse(value) as unknown
    const valid = z.array(noteSchema).parse(parsed)
    return valid
  } catch {
    return null
  }
})()

export type Note = Resolve<z.infer<typeof noteSchema>>

export const notesData = createSlice({
  name: "notes",
  defaultValue: legacyValue ?? ([notesInitialData] as Note[]),
  effects: [indexedDb()],
  reducers: {
    add: (
      state,
      note: Omit<Note, "id" | "createdAt" | "locked">,
      forcedId?: string
    ) => [
      ...state,
      {
        ...note,
        id: forcedId ?? getNextId(),
        createdAt: Date.now(),
        locked: false,
      },
    ],
    edit: (state, id: string, data: Partial<Omit<Note, "id">>) =>
      state.map(note =>
        note.id === id ? { ...note, ...data, changedAt: Date.now() } : note
      ),
    remove: (state, id: string) => {
      const newState = state.filter(note => note.id !== id)
      return state.length !== newState.length ? newState : state
    },
  },
})

// TODO: Delete migration
if (JSON.stringify(legacyValue) === JSON.stringify(notesData.get())) {
  window.localStorage.removeItem(legacyKey)
}

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
