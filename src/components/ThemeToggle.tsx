import { useEffect } from "react"

import { Sun, MoonStar, SunMoon, LucideIcon } from "lucide-react"
import { atom, derive, localStorage } from "yaasl"
import { useAtom, useDerivedValue } from "yaasl/react"

import { IconButton } from "./IconButton"

const getSystemMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

type ThemeMode = "dark" | "light" | "system"

const modeAtom = atom<ThemeMode>({
  name: "theme-mode",
  defaultValue: "system",
  middleware: [localStorage()],
})

const displayedMode = derive(({ get }) => {
  const mode = get(modeAtom)
  return mode === "system" ? getSystemMode() : mode
})

export const useApplyThemeMode = () => {
  const mode = useDerivedValue(displayedMode)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(mode)
  }, [mode])
}

const nextMode: Record<ThemeMode, ThemeMode> = {
  system: "dark",
  dark: "light",
  light: "system",
}

const modeIcon: Record<ThemeMode, LucideIcon> = {
  system: SunMoon,
  dark: MoonStar,
  light: Sun,
}

export const ThemeToggle = () => {
  const [mode, setMode] = useAtom(modeAtom)
  const next = nextMode[mode]

  const toggleMode = () => {
    setMode(mode => nextMode[mode])
  }

  return (
    <IconButton
      icon={modeIcon[mode]}
      title={`Set theme to ${next}`}
      onClick={toggleMode}
    />
  )
}
