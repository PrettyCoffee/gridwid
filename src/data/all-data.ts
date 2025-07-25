import { z } from "zod"

import { noteSchema, notesData } from "data/notes"
import { themeData, themeSchema } from "data/theme"
import { createDerived } from "lib/yaasl"
import { Resolve } from "types/util-types"

const allDataSchema = z.object({
  notes: z.optional(z.array(noteSchema)),
  theme: z.optional(themeSchema),
})

export type AllData = Resolve<z.infer<typeof allDataSchema>>

const data = createDerived<AllData>(
  ({ get }) => {
    const notes = get(notesData)
    const theme = get(themeData)
    return { notes, theme }
  },

  ({ value, set }) => {
    if (value.notes) set(notesData, value.notes)
    if (value.theme) set(themeData, value.theme)
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
      theme: themeData.defaultValue,
    }),
}
