import { createSlice } from "lib/yaasl"

import { theme } from "../../../tailwind/theme"

const darkTheme = theme.getCssVars()

const lightTheme = theme.getCssVars(colors => ({
  mode: "light" as "dark" | "light",
  radius: 8,
  color: {
    neutral: {
      "0": "#fff",
      "50": colors.zinc["950"],
      "100": colors.zinc["900"],
      "200": colors.zinc["800"],
      "300": colors.zinc["700"],
      "400": colors.zinc["600"],
      "500": colors.zinc["500"],
      "600": colors.zinc["400"],
      "700": colors.zinc["300"],
      "800": colors.zinc["200"],
      "900": colors.zinc["100"],
      "950": colors.zinc["50"],
      "1000": "#000",
    },
    accent: colors.rose[500],
    alert: {
      error: colors.red[500],
      warn: colors.yellow[500],
      info: colors.blue[500],
      success: colors.green[500],
    },
    category: {
      red: colors.pink[500],
      orange: colors.orange[500],
      yellow: colors.amber[500],
      green: colors.lime[500],
      cyan: colors.sky[500],
      blue: colors.blue[500],
      violet: colors.violet[500],
    },
  },
}))

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
  const vars = isDark ? darkTheme : lightTheme
  const root = document.documentElement

  root.classList.toggle("dark", isDark)
  Object.entries(vars).forEach(([varName, value]) => {
    //document.body.style.setProperty(varName, value)
    root.style.setProperty(varName, value)
  })
}

updateTheme()
themePreferences.subscribe(updateTheme)
