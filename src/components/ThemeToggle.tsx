import { useEffect } from "react"

import { Sun, MoonStar, SunMoon, LucideIcon, Cat } from "lucide-react"
import {
  atom,
  derive,
  localStorage,
  reduxDevtools,
  useAtom,
  useDerivedValue,
} from "yaasl/react"

import { cn } from "~/lib/utils"
import { yaaslSetup } from "~/lib/yaaslSetup"

import { HStack } from "./base/Stack"
import { Icon } from "./Icon"
import { ListItem } from "./ListItem"

const getSystemMode = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

type ThemeMode = "dark" | "light" | "system" | "mocha"
const modes: ThemeMode[] = ["system", "dark", "light", "mocha"]

yaaslSetup()

const modeAtom = atom<ThemeMode>({
  name: "theme-mode",
  defaultValue: "system",
  middleware: [
    localStorage(),
    reduxDevtools({ disable: !import.meta.env.DEV }),
  ],
})

const displayedMode = derive(({ get }) => {
  const mode = get(modeAtom)
  return mode === "system" ? getSystemMode() : mode
})

export const useApplyThemeMode = () => {
  const mode = useDerivedValue(displayedMode)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark", "mocha")
    root.classList.add(mode)
  }, [mode])
}

const modeIcon: Record<ThemeMode, LucideIcon> = {
  system: SunMoon,
  dark: MoonStar,
  light: Sun,
  mocha: Cat,
}

const modeCircle = "w-4 h-4 rounded-full border border-accent-foreground"

const ModePreview = ({ mode }: { mode: ThemeMode }) => {
  return (
    <HStack className={cn(mode, "-space-x-1.5")}>
      <div className={cn(modeCircle, "bg-background")} />
      <div className={cn(modeCircle, "bg-foreground")} />
      <div className={cn(modeCircle, "bg-highlight")} />
    </HStack>
  )
}

export const ThemeToggle = () => {
  const [currentMode, setCurrentMode] = useAtom(modeAtom)

  return modes.map(mode => (
    <ListItem.Root key={mode} compact>
      <HStack asChild items="center">
        <ListItem.Clickable onClick={() => setCurrentMode(mode)}>
          <Icon icon={modeIcon[mode]} size="sm" />
          <ListItem.Caption
            active={currentMode === mode}
            title={mode}
            className="flex-1"
          />
          {mode !== "system" && <ModePreview mode={mode} />}
        </ListItem.Clickable>
      </HStack>
    </ListItem.Root>
  ))
}
