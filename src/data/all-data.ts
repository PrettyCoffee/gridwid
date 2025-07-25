import { z } from "zod"

import { noteSchema, notesData } from "data/notes"
import { createDerived } from "lib/yaasl"
import { Resolve } from "types/util-types"

const allDataSchema = z.object({
  notes: z.optional(z.array(noteSchema)),
})

export type AllData = Resolve<z.infer<typeof allDataSchema>>

const data = createDerived<AllData>(
  ({ get }) => {
    const notes = get(notesData)
    return { notes }
  },

  ({ value, set }) => {
    if (value.notes) set(notesData, value.notes)
  }
)

export const allData = {
  get: () => data.get(),

  validate: (data: unknown) => allDataSchema.parse(data),

  patch: (value: Partial<AllData>) =>
    data.set(state => ({ ...state, ...value })),

  reset: () =>
    data.set({
      notes: notesData.defaultValue,
    }),
}
