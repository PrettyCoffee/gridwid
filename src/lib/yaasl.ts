import { reduxDevtools, logger } from "@yaasl/devtools"
import { CONFIG, createEffect } from "@yaasl/react"

import { isDevEnv } from "utils/is-dev-env"

CONFIG.name = "gridwid"
CONFIG.globalEffects = [
  reduxDevtools({ disable: !isDevEnv }),
  logger({ disable: !isDevEnv }),
]

export * from "@yaasl/react"

interface SortOptions<TData> {
  sortFn: (a: TData, b: TData) => number
}
export const autoSort = <TData>({ sortFn }: SortOptions<TData>) => {
  const sortEffect = createEffect<SortOptions<TData>, TData[]>({
    sort: "pre",
    set: ({ value, options, set }) => {
      if (!Array.isArray(value)) {
        throw new Error(
          "The `autoSort` effect, cannot be used on non-array value atoms."
        )
      }

      set(value.toSorted(options.sortFn))
    },
  })

  return sortEffect({ sortFn })
}
