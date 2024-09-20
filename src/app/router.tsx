import { Home, ListCheck, Notebook, Book, Cog, Wrench } from "lucide-react"
import { lazy } from "react"

import { AppLayout, SettingsLayout, ToolsLayout } from "components/layouts"
import { createRoutes, HashRouter } from "components/utility/hash-router"

import { NotFoundRoute } from "./routes/not-found"

const LazyPlaceholder = lazy(() => import("./routes/placeholder"))

const routes = createRoutes([
  {
    path: "",
    meta: { title: "Home", icon: Home, isMainRoute: true },
    Component: lazy(() => import("./routes/main")),
  },
  {
    path: "todos",
    meta: { title: "Todos", icon: ListCheck, isMainRoute: true },
    Component: LazyPlaceholder,
    subroutes: [
      {
        path: "todos/:id",
        Component: LazyPlaceholder,
      },
    ],
  },
  {
    path: "notes",
    meta: { title: "Notes", icon: Notebook, isMainRoute: true },
    Component: lazy(() => import("./routes/notes/notes-main")),
    subroutes: [
      {
        path: "notes/:id",
        Component: lazy(() => import("./routes/notes/notes-id")),
      },
    ],
  },
  {
    path: "bookmarks",
    meta: { title: "Bookmarks", icon: Book, isMainRoute: true },
    Component: LazyPlaceholder,
  },
  {
    path: "tools",
    meta: { title: "Tools", icon: Wrench, isMainRoute: true },
    Layout: ToolsLayout,
    Component: LazyPlaceholder,
    subroutes: [
      {
        path: "tools/color-picker",
        Component: LazyPlaceholder,
      },
    ],
  },
  {
    path: "settings",
    meta: { title: "Settings", icon: Cog, isMainRoute: false },
    Layout: SettingsLayout,
    Component: LazyPlaceholder,
    subroutes: [
      {
        path: "settings/taskbar",
        Component: LazyPlaceholder,
      },
      {
        path: "settings/widgets",
        Component: LazyPlaceholder,
      },
      {
        path: "settings/theming",
        Component: LazyPlaceholder,
      },
      {
        path: "settings/data",
        Component: LazyPlaceholder,
      },
      {
        path: "settings/workspaces",
        Component: LazyPlaceholder,
      },
    ],
  },
])

export const AppRouter = () => (
  <HashRouter.Router
    routes={routes}
    Layout={AppLayout}
    Fallback={NotFoundRoute}
  />
)
