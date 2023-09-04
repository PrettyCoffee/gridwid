import { useEffect } from "react"

import { Sun, MoonStar, SunMoon } from "lucide-react"
import { atom, derive } from "yaasl/core"
import { localStorage } from "yaasl/middleware"
import { useSetAtom, useDerivedValue, useAtomValue } from "yaasl/react"

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

const useThemeMode = () =>
  [useDerivedValue(displayedMode), useSetAtom(modeAtom)] as const

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

export const ThemeToggle = () => {
  const rawMode = useAtomValue(modeAtom)
  const [mode, setMode] = useThemeMode()
  const next = nextMode[mode]

  const toggleMode = () => {
    setMode(mode => nextMode[mode])
  }

  return (
    <IconButton
      icon={rawMode === "light" ? Sun : rawMode === "dark" ? MoonStar : SunMoon}
      title={`Set theme to ${next}`}
      onClick={toggleMode}
    />
  )
}
