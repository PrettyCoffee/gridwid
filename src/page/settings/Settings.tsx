import { atom, reduxDevtools, useAtomValue } from "yaasl/react"

import { isProdEnv } from "~/lib/isDevEnv"

import { GeneralSettings } from "./GeneralSettings"
import { TaskbarSettings } from "./TaskbarSettings"
import { ThemeSettings } from "./ThemeSettings"
import { WidgetLayoutSettings } from "./WidgetLayoutSettings"

type SettingView = "general" | "widget-layout" | "taskbar" | "theme"

export const settingsView = atom<SettingView | null>({
  defaultValue: null,
  name: "settingsView",
  middleware: [reduxDevtools({ disable: isProdEnv })],
})

export const Settings = () => {
  const view = useAtomValue(settingsView)
  return (
    <>
      <GeneralSettings open={view === "general"} />
      <WidgetLayoutSettings open={view === "widget-layout"} />
      <TaskbarSettings open={view === "taskbar"} />
      <ThemeSettings open={view === "theme"} />
    </>
  )
}
