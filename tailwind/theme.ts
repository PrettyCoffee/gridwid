import { createTheme } from "./plugins/theme-vars-plugin"

/* eslint-disable sonarjs/no-duplicate-string */
export const theme = createTheme({
  theme: colors => ({
    mode: "dark",
    radius: 1,
    color: {
      neutral: colors.zinc,
      accent: colors.rose[300],
      alert: {
        error: colors.red[300],
        warn: colors.yellow[300],
        info: colors.blue[300],
        success: colors.green[300],
      },
    },
  }),

  tokens: get => ({
    borderRadius: {
      lg: get("radius", "calc(<var> * 0.5rem)"),
      md: get("radius", "calc(<var> * 0.375rem)"),
      sm: get("radius", "calc(<var> * 0.25rem)"),
      full: "9999px",
      none: "0px",
    },
    colors: {
      black: { DEFAULT: "black" },
      white: { DEFAULT: "white" },
      transparent: { DEFAULT: "transparent" },
      current: { DEFAULT: "currentColor" },
      inherit: { DEFAULT: "inherit" },

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
    },
  }),
})
