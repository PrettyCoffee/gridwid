import { createTheme } from "./plugins/theme-vars-plugin"

export const theme = createTheme({
  theme: colors => ({
    mode: "dark",
    radius: 8,
    color: {
      neutral: {
        "0": "#000",
        ...colors.zinc,
        "1000": "#fff",
      },
      accent: colors.rose[300],
      alert: {
        error: colors.red[300],
        warn: colors.yellow[300],
        info: colors.blue[300],
        success: colors.green[300],
      },
      category: {
        red: colors.pink[300],
        orange: colors.orange[300],
        yellow: colors.amber[300],
        green: colors.lime[300],
        cyan: colors.sky[300],
        blue: colors.blue[300],
        violet: colors.violet[300],
      },
    },
  }),

  tokens: get => ({
    borderRadius: {
      lg: get("radius", "calc(<var> / 16 * 1rem)"), // 0.5rem
      md: get("radius", "calc(<var> / 24 * 1rem)"), // 0.375rem
      sm: get("radius", "calc(<var> / 32 * 1rem)"), // 0.25rem
      full: "9999px",
      none: "0px",
    },
    colors: {
      black: get("color.neutral.0"),
      white: get("color.neutral.1000"),
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      highlight: get("color.accent"),
      background: {
        page: get("color.neutral.950"),
        DEFAULT: get("color.neutral.900"),
        invert: get("color.neutral.50"),
        button: get("color.neutral.50"),
      },
      text: {
        priority: get("color.neutral.50"),
        DEFAULT: get("color.neutral.200"),
        gentle: get("color.neutral.400"),
        //muted: get("color.neutral.400"),
        invert: get("color.neutral.950"),
        button: get("color.neutral.950"),
      },
      stroke: {
        DEFAULT: get("color.neutral.400"),
        gentle: get("color.neutral.800"),
        //muted: get("color.neutral.800"),
        invert: get("color.neutral.50"),
        button: get("color.neutral.50"),
        focus: get("color.accent"),
      },
      alert: {
        error: get("color.alert.error"),
        warn: get("color.alert.warn"),
        info: get("color.alert.info"),
        success: get("color.alert.success"),
      },
      category: {
        red: get("color.category.red"),
        orange: get("color.category.orange"),
        yellow: get("color.category.yellow"),
        green: get("color.category.green"),
        cyan: get("color.category.cyan"),
        blue: get("color.category.blue"),
        violet: get("color.category.violet"),
      },
    },
  }),
})
