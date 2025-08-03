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
    init: ({ value, options, set }) => {
      set(value.toSorted(options.sortFn))
    },
    set: ({ value, options, set }) => {
      set(value.toSorted(options.sortFn))
    },
  })

  return sortEffect({ sortFn })
}
