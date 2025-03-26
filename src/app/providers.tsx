import { PropsWithChildren } from "react"

import { DialogProvider } from "components/ui/dialog"
import { Toaster } from "components/ui/toaster"
import { Tooltip } from "components/ui/tooltip"
import { HashRouter } from "components/utility/hash-router"

export const AppProviders = ({ children }: PropsWithChildren) => (
  <HashRouter.Provider>
    <Tooltip.Provider>
      <Toaster />
      <DialogProvider />
      {children}
    </Tooltip.Provider>
  </HashRouter.Provider>
)
