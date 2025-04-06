import { Fragment, PropsWithChildren, useMemo } from "react"

import { createContext } from "utils/create-context"

import {
  BaseRoute,
  LazyOrFunctionComponent,
  FlatRoute,
  UrlParams,
} from "./types"
import { useCurrentRoute } from "./use-current-route"

interface ContextState {
  route: BaseRoute | null
  params: UrlParams
  allRoutes: BaseRoute[]
}

const { Provider, useOptionalValue } =
  createContext<ContextState>("HashRouterRouter")

export const useHashRouterRouterContext = useOptionalValue

interface HashRouterProps {
  routes: FlatRoute[]
  Layout?: LazyOrFunctionComponent<PropsWithChildren>
  Fallback?: LazyOrFunctionComponent
}

export const HashRouterRouter = ({
  routes,
  Layout = Fragment,
  Fallback,
}: HashRouterProps) => {
  const match = useCurrentRoute(routes)

  const contextState = useMemo(
    () => ({
      route: match?.route ?? null,
      params: match?.params ?? {},
      allRoutes: routes.map(({ route }) => route),
    }),
    [match, routes]
  )

  return (
    <Provider value={contextState}>
      <Layout>
        {match ? (
          <match.Layout>
            <match.Component />
          </match.Layout>
        ) : Fallback ? (
          <Fallback />
        ) : null}
      </Layout>
    </Provider>
  )
}
