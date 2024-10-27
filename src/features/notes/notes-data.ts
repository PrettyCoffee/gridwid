// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker"

import { createSlice, localStorage } from "lib/yaasl"
import { getNextId } from "utils/get-next-id"

export interface Note {
  id: string
  createdAt: number
  changedAt?: number
  title: string
  text: string
}

export const createRandomNote = (): Omit<Note, "id" | "createdAt"> => ({
  title: faker.lorem.words({ min: 2, max: 4 }),
  text: faker.lorem.paragraph({ min: 5, max: 15 }),
})

export const notesData = createSlice({
  name: "notes",
  defaultValue: [] as Note[],
  effects: [localStorage()],
  reducers: {
    add: (state, note: Omit<Note, "id" | "createdAt">) => [
      ...state,
      { ...note, id: getNextId(), createdAt: Date.now() },
    ],
    edit: (state, id: string, data: Partial<Omit<Note, "id">>) =>
      state.map(note =>
        note.id === id ? { ...note, ...data, changedAt: Date.now() } : note
      ),
    remove: (state, id: string) => state.filter(note => note.id !== id),
  },
})

if (notesData.get().length === 0) {
  notesData.actions.add(createRandomNote())
  notesData.actions.add(createRandomNote())
  notesData.actions.add(createRandomNote())
  notesData.actions.add(createRandomNote())
  notesData.actions.add(createRandomNote())
}
