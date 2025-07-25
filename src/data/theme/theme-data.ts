import { createSlice, sessionStorage } from "lib/yaasl"
import { getCssVarValue } from "utils/get-css-var-value"

import { theme } from "../../../tailwind/theme"

export interface ThemePreferences {
  mode: "dark" | "light"
  radius: number
  accent: Parameters<typeof theme.getCssVar>[0]
}

const defaultValue: ThemePreferences = {
  radius: theme.defaultTokens.radius,
  mode: "dark",
  accent: "color.accent",
}

export const themePreferences = createSlice({
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
  const { mode, radius, accent } = themePreferences.get()
  const isDark = mode === "dark"
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
  root.style.setProperty(...theme.write("radius", radius))
  root.style.setProperty(
    ...theme.write("color.accent", getCssVarValue(theme.getCssVar(accent)))
  )
}

updateTheme()
themePreferences.subscribe(updateTheme)
