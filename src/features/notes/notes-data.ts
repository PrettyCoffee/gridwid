// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker"

import { createSlice } from "lib/yaasl"
import { createId } from "utils/create-id"

export interface Note {
  id: string
  createdAt: number
  changedAt?: number
  title: string
  text: string
}

export const createRandomNote = (): Note => ({
  createdAt: faker.date.recent().valueOf(),
  id: createId(),
  title: faker.lorem.words({ min: 2, max: 4 }),
  text: faker.lorem.paragraph({ min: 3, max: 15 }),
})

export const notesData = createSlice({
  name: "notes",
  defaultValue: [
    createRandomNote(),
    createRandomNote(),
    createRandomNote(),
    createRandomNote(),
    createRandomNote(),
  ] as Note[],
  reducers: {
    add: (state, note: Omit<Note, "id" | "createdAt">) => [
      ...state,
      { ...note, id: createId(), createdAt: Date.now() },
    ],
    edit: (state, id: string, data: Partial<Omit<Note, "id">>) =>
      state.map(note =>
        note.id === id ? { ...note, ...data, changedAt: Date.now() } : note
      ),
    remove: (state, id: string) => state.filter(note => note.id !== id),
  },
})
