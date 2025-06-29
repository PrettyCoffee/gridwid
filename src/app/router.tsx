import { lazy } from "react"

import {
  Bookmark,
  Cog,
  Shapes,
  LayoutGrid,
  CheckCheck,
  FileText,
  Palette,
  Database,
  LayoutDashboard,
  PanelBottom,
  Layers,
} from "lucide-react"

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
    Layout: SettingsLayout.Main,
    Component: lazy(() => import("./routes/settings/settings-main")),
    subroutes: [
      {
        path: "settings/general",
        Component: LazyPlaceholder,
        Layout: SettingsLayout.Catagory,
        meta: { title: "General", icon: Cog },
      },
      {
        path: "settings/taskbar",
        Component: LazyPlaceholder,
        Layout: SettingsLayout.Catagory,
        meta: { title: "Taskbar", icon: PanelBottom },
      },
      {
        path: "settings/widgets",
        Component: LazyPlaceholder,
        Layout: SettingsLayout.Catagory,
        meta: { title: "Widgets", icon: LayoutDashboard },
      },
      {
        path: "settings/theming",
        Component: lazy(() => import("./routes/settings/settings-theming")),
        Layout: SettingsLayout.Catagory,
        meta: { title: "Theming", icon: Palette },
      },
      {
        path: "settings/data",
        Component: lazy(() => import("./routes/settings/settings-data")),
        Layout: SettingsLayout.Catagory,
        meta: { title: "Data", icon: Database },
      },
      {
        path: "settings/workspaces",
        Component: LazyPlaceholder,
        Layout: SettingsLayout.Catagory,
        meta: { title: "Workspaces", icon: Layers },
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
