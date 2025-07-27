import { reduxDevtools, logger } from "@yaasl/devtools"
import { CONFIG } from "@yaasl/react"

import { isDevEnv } from "utils/is-dev-env"

CONFIG.name = "gridwid"
CONFIG.globalEffects = [
  reduxDevtools({ disable: !isDevEnv }),
  logger({ disable: !isDevEnv }),
]

export * from "@yaasl/react"
