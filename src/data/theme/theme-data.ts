import { z } from "zod"

import { createSlice, sessionStorage } from "lib/yaasl"
import { Resolve } from "types/util-types"
import { getCssVarValue } from "utils/get-css-var-value"

import { theme } from "../../../tailwind/theme"

export const themeAccentColors = [
  "color.category.pink",
  "color.category.rose",
  "color.category.orange",
  "color.category.yellow",
  "color.category.lime",
  "color.category.green",
  "color.category.teal",
  "color.category.cyan",
  "color.category.blue",
  "color.category.indigo",
  "color.category.violet",
  "color.category.fuchsia",
  "color.text.priority",
] satisfies Parameters<typeof theme.getCssVar>[0][]

export const themeSchema = z.object({
  radius: z.number(),
  mode: z.enum(["dark", "light"]),
  colored: z.boolean(),
  accent: z.enum(themeAccentColors),
})

export type ThemePreferences = Resolve<z.infer<typeof themeSchema>>

const defaultValue: ThemePreferences = {
  radius: theme.defaultTokens.radius,
  mode: "dark",
  colored: false,
  accent: "color.category.rose",
}

export const themeData = createSlice({
  name: "user-theme",
  defaultValue,
  effects: [sessionStorage()],

  reducers: {
    setAccent: (state, accent: ThemePreferences["accent"]) => ({
      ...state,
      accent,
    }),
    setMode: (state, mode: ThemePreferences["mode"]) => ({ ...state, mode }),
    toggleColored: state => ({ ...state, colored: !state.colored }),
    setRadius: (state, radius: ThemePreferences["radius"]) => ({
      ...state,
      radius,
    }),
  },
  selectors: {
    getAccent: state => state.accent,
    getMode: state => state.mode,
    getRadius: state => state.radius,
    getColored: state => state.colored,
  },
})

const updateTheme = () => {
  const { mode, colored, radius, accent } = themeData.get()
  const isDark = mode === "dark"
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
  root.classList.toggle("dark-with-accent", isDark && colored)
  root.classList.toggle("light-with-accent", !isDark && colored)
  root.style.setProperty(...theme.write("radius", radius))

  const accentValue = getCssVarValue(theme.getCssVar(accent))
  root.style.setProperty(...theme.write("color.accent", accentValue))

  const accentHue = Number(accentValue.split(" ")[2])
  root.style.setProperty(...theme.write("color.accentHue", accentHue))
}

updateTheme()
themeData.subscribe(updateTheme)
