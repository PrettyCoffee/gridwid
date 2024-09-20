import { useMemo } from "react"

import { useHashRouterContext } from "./hash-router-context"
import { matchPath } from "./match-path"
import { FlatRoute, UrlParams } from "./types"

interface MatchedRoute extends FlatRoute {
  params: UrlParams | null
}

export const useCurrentRoute = (routes: FlatRoute[]) => {
  const { path } = useHashRouterContext()
  return useMemo(
    () =>
      routes.reduce<MatchedRoute | null>((match, item) => {
        if (match) return match
        const params = matchPath(item.route.path, path)
        return params ? { ...item, params } : null
      }, null),
    [path, routes]
  )
}
