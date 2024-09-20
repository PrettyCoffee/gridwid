import { useMemo } from "react"

import { HashRouterProvider, useHashRouterContext } from "./hash-router-context"
import { HashRouterLink } from "./hash-router-link"
import {
  HashRouterRouter,
  useHashRouterRouterContext,
} from "./hash-router-router"

export { createRoutes } from "./create-routes"
export { type HashRouterLinkProps } from "./hash-router-link"

export const HashRouter = {
  Router: HashRouterRouter,
  Provider: HashRouterProvider,
  Link: HashRouterLink,
}

export const useHashRouter = () => {
  const context = useHashRouterContext()
  const routerContext = useHashRouterRouterContext()
  return useMemo(
    () => ({ params: {}, ...context, ...(routerContext ?? {}) }),
    [context, routerContext]
  )
}
