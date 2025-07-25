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
  accent: z.enum(themeAccentColors),
})

export type ThemePreferences = Resolve<z.infer<typeof themeSchema>>

const defaultValue: ThemePreferences = {
  radius: theme.defaultTokens.radius,
  mode: "dark",
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
    setRadius: (state, radius: ThemePreferences["radius"]) => ({
      ...state,
      radius,
    }),
  },
  selectors: {
    getAccent: state => state.accent,
    getMode: state => state.mode,
    getRadius: state => state.radius,
  },
})

const updateTheme = () => {
  const { mode, radius, accent } = themeData.get()
  const isDark = mode === "dark"
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
  root.style.setProperty(...theme.write("radius", radius))
  root.style.setProperty(
    ...theme.write("color.accent", getCssVarValue(theme.getCssVar(accent)))
  )
}

updateTheme()
themeData.subscribe(updateTheme)
