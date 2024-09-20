import { reduxDevtools, logger } from "@yaasl/devtools"
import { CONFIG } from "@yaasl/react"

const isDevServer = import.meta.env.DEV && import.meta.env.MODE !== "test"

CONFIG.name = "gridwid"
CONFIG.globalEffects = [
  reduxDevtools({ disable: !isDevServer }),
  logger({ disable: !isDevServer }),
]

export * from "@yaasl/react"
