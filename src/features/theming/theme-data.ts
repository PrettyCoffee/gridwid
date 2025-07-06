import { createSlice } from "lib/yaasl"

import { theme } from "../../../tailwind/theme"

export interface ThemePreferences {
  mode: "dark" | "light"
  radius: number
}

const defaultValue: ThemePreferences = {
  radius: theme.defaultTokens.radius,
  mode: "dark",
}

export const themePreferences = createSlice({
  name: "user-theme",
  defaultValue,

  reducers: {
    setMode: (state, mode: ThemePreferences["mode"]) => ({ ...state, mode }),
    setRadius: (state, radius: ThemePreferences["radius"]) => ({
      ...state,
      radius,
    }),
  },
  selectors: {
    getMode: state => state.mode,
    getRadius: state => state.radius,
  },
})

const updateTheme = () => {
  const { mode, radius } = themePreferences.get()
  const isDark = mode === "dark"
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
  root.style.setProperty(...theme.write("radius", radius))
}

updateTheme()
themePreferences.subscribe(updateTheme)
