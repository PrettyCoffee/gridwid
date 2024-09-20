import { PropsWithChildren } from "react"

import { Toaster } from "components/ui/toaster"
import { Tooltip } from "components/ui/tooltip"
import { HashRouter } from "components/utility/hash-router"

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <HashRouter.Provider>
      <Tooltip.Provider>
        <Toaster />
        {children}
      </Tooltip.Provider>
    </HashRouter.Provider>
  )
}
