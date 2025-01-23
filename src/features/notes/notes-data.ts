import { createSlice, localStorage } from "lib/yaasl"
import { getNextId } from "utils/get-next-id"

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
  defaultValue: [] as Note[],
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
