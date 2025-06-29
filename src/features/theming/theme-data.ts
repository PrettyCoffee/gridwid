import { createSlice } from "lib/yaasl"

export interface ThemePreferences {
  mode: "dark" | "light"
}

export const themePreferences = createSlice({
  name: "user-theme",
  defaultValue: {
    mode: "dark",
  } as ThemePreferences,

  reducers: {
    setMode: (state, mode: ThemePreferences["mode"]) => ({ ...state, mode }),
  },
  selectors: {
    getMode: state => state.mode,
  },
})

const updateTheme = () => {
  const isDark = themePreferences.get().mode === "dark"
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
}

updateTheme()
themePreferences.subscribe(updateTheme)
