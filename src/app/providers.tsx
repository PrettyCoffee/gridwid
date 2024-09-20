import { PropsWithChildren } from "react"

import { Toaster } from "components/ui/toaster"
import { HashRouter } from "components/utility/hash-router"

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <HashRouter.Provider>
      <Toaster />
      {children}
    </HashRouter.Provider>
  )
}
