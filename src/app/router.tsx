import {
  Bookmark,
  Cog,
  Shapes,
  LayoutGrid,
  CheckCheck,
  FileText,
} from "lucide-react"
import { lazy } from "react"

import { SettingsLayout, ToolsLayout } from "components/layouts"
import { createRoutes, HashRouter } from "components/utility/hash-router"

import { AppLayout } from "./layout"
import { NotFoundRoute } from "./routes/not-found"

const LazyPlaceholder = lazy(() => import("./routes/placeholder"))

const routes = createRoutes([
  {
    path: "",
    meta: { title: "Overview", icon: LayoutGrid, isMainRoute: true },
    Component: lazy(() => import("./routes/main")),
  },
  {
    path: "todos",
    meta: { title: "Todos", icon: CheckCheck, isMainRoute: true },
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
    meta: { title: "Notes", icon: FileText, isMainRoute: true },
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
    meta: { title: "Bookmarks", icon: Bookmark, isMainRoute: true },
    Component: LazyPlaceholder,
  },
  {
    path: "tools",
    meta: { title: "Tools", icon: Shapes, isMainRoute: true },
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
