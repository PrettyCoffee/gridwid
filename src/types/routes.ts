import { IconProp } from "./base-props"

export type RoutePath =
  | ""
  | "todos"
  | `todos/${string}`
  | "notes"
  | `notes/${string}`
  | "bookmarks"
  | "tools"
  | "tools/color-picker"
  | "settings"
  | "settings/taskbar"
  | "settings/widgets"
  | "settings/theming"
  | "settings/data"
  | "settings/workspaces"

export interface RouteMeta extends IconProp {
  isMainRoute?: boolean
  title?: string
}
