// eslint-disable-next-line import/no-extraneous-dependencies
import { faker } from "@faker-js/faker"

import { createSlice } from "lib/yaasl"
import { createId } from "utils/create-id"

export interface Note {
  id: string
  createdAt: number
  title: string
  text: string
}

export const createRandomNote = (): Note => ({
  createdAt: faker.date.recent().valueOf(),
  id: createId(),
  title: faker.lorem.words(3),
  text: faker.lorem.paragraph(),
})

export const notesData = createSlice({
  name: "notes",
  defaultValue: [
    createRandomNote(),
    createRandomNote(),
    createRandomNote(),
  ] as Note[],
  reducers: {
    add: (state, note: Omit<Note, "id" | "createdAt">) => [
      ...state,
      { ...note, id: createId(), createdAt: Date.now() },
    ],
    remove: (state, id: string) => state.filter(note => note.id !== id),
  },
})
