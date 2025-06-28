import { Moon, Sun } from "lucide-react"

import { IconButton } from "components/ui/icon-button"
import { useAtomValue } from "lib/yaasl"

import { themePreferences } from "./theme-data"

export const ThemeModeToggle = () => {
  const mode = useAtomValue(themePreferences.selectors.getMode)
  return mode === "dark" ? (
    <IconButton
      title="Light mode"
      hideTitle
      icon={Sun}
      onClick={() => themePreferences.actions.setMode("light")}
    />
  ) : (
    <IconButton
      title="Dark mode"
      hideTitle
      icon={Moon}
      onClick={() => themePreferences.actions.setMode("dark")}
    />
  )
}
