import { faker } from "@faker-js/faker"

import { createRange } from "utils/create-range"

import { Note } from "./notes-data"

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

export const mockNotes = (amount: number) => {
  faker.seed(1337)
  id = 0
  return createRange(0, amount).map(createNote)
}
