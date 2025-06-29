import { createTheme } from "./plugins/theme-vars-plugin"

export const theme = createTheme({
  theme: colors => ({
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

theme.addVariant("dark", colors => ({
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
}))
