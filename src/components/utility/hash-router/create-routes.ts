import { FlatRoute, Route } from "./types"

const flattenRoute = (route: Route, parent: FlatRoute | null): FlatRoute => {
  const layouts = [...(parent?.layouts ?? [])]
  if (route.Layout) layouts.push(route.Layout)

  return {
    route: {
      path: route.path,
      meta: route.meta ?? {},
      parent: parent?.route ?? null,
      subroutes: [],
    },
    layouts,
    Component: route.Component,
  }
}

const flattenRoutes = (
  routes: Route[],
  parent: FlatRoute | null
): FlatRoute[] =>
  routes.reduce<FlatRoute[]>((result, route) => {
    const flatRoute = flattenRoute(route, parent)
    result.push(flatRoute)

    if (route.subroutes) {
      const subroutes = flattenRoutes(route.subroutes, flatRoute)
      flatRoute.route.subroutes = subroutes.map(({ route }) => route)
      result.push(...subroutes)
    }

    return result
  }, [])

export const createRoutes = (routes: Route[]) => flattenRoutes(routes, null)
