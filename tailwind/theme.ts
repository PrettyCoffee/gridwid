import twColors from "tailwindcss/colors"

import { createTheme } from "./plugins/theme-vars-plugin"

const colors = {
  neutral: {
    "0": "#000",
    ...twColors.zinc,
    "1000": "#fff",
  },
  accent: twColors.rose,
  alert: {
    error: twColors.red,
    warn: twColors.yellow,
    info: twColors.blue,
    success: twColors.green,
  },
  category: {
    red: twColors.pink,
    orange: twColors.orange,
    yellow: twColors.amber,
    green: twColors.lime,
    cyan: twColors.sky,
    blue: twColors.blue,
    violet: twColors.violet,
  },
}

export const theme = createTheme({
  theme: {
    radius: 8,
    color: {
      black: colors.neutral["1000"],
      white: colors.neutral["0"],
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      highlight: colors.accent["500"],
      background: {
        page: colors.neutral["50"],
        default: colors.neutral["100"],
        invert: colors.neutral["950"],
        button: colors.neutral["950"],
      },
      text: {
        priority: colors.neutral["950"],
        default: colors.neutral["800"],
        gentle: colors.neutral["600"],
        //muted: colors.neutral["400"],
        invert: colors.neutral["50"],
        button: colors.neutral["50"],
      },
      stroke: {
        default: colors.neutral["600"],
        gentle: colors.neutral["200"],
        //muted: colors.neutral["800"],
        invert: colors.neutral["950"],
        button: colors.neutral["950"],
        focus: colors.accent["500"],
      },
      alert: {
        error: colors.alert.error["500"],
        warn: colors.alert.warn["500"],
        info: colors.alert.info["500"],
        success: colors.alert.success["500"],
      },
      category: {
        red: colors.category.red["500"],
        orange: colors.category.orange["500"],
        yellow: colors.category.yellow["500"],
        green: colors.category.green["500"],
        cyan: colors.category.cyan["500"],
        blue: colors.category.blue["500"],
        violet: colors.category.violet["500"],
      },
    },
  },

  tokens: get => ({
    borderRadius: {
      lg: get("radius", "calc(<var> / 16 * 1rem)"), // 0.5rem
      md: get("radius", "calc(<var> / 24 * 1rem)"), // 0.375rem
      sm: get("radius", "calc(<var> / 32 * 1rem)"), // 0.25rem
      full: "9999px",
      none: "0px",
    },
    colors: {
      black: get("color.black"),
      white: get("color.white"),
      transparent: "transparent",
      current: "currentColor",
      inherit: "inherit",

      highlight: get("color.highlight"),
      // TODO: Add handler to convert whole objects, e.g. get("color.background")
      background: {
        page: get("color.background.page"),
        DEFAULT: get("color.background.default"),
        invert: get("color.background.invert"),
        button: get("color.background.button"),
      },
      text: {
        priority: get("color.text.priority"),
        DEFAULT: get("color.text.default"),
        gentle: get("color.text.gentle"),
        //muted: get("color.text.muted"),
        invert: get("color.text.invert"),
        button: get("color.text.button"),
      },
      stroke: {
        DEFAULT: get("color.stroke.default"),
        gentle: get("color.stroke.gentle"),
        //muted: get("color.neutral.800"),
        invert: get("color.stroke.invert"),
        button: get("color.stroke.button"),
        focus: get("color.stroke.focus"),
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

theme.addVariant("dark", {
  radius: 8,
  color: {
    black: colors.neutral["0"],
    white: colors.neutral["1000"],
    transparent: "transparent",
    current: "currentColor",
    inherit: "inherit",

    highlight: colors.accent["300"],
    background: {
      page: colors.neutral["950"],
      default: colors.neutral["900"],
      invert: colors.neutral["50"],
      button: colors.neutral["50"],
    },
    text: {
      priority: colors.neutral["50"],
      default: colors.neutral["200"],
      gentle: colors.neutral["400"],
      //muted: colors.neutral["400"],
      invert: colors.neutral["950"],
      button: colors.neutral["950"],
    },
    stroke: {
      default: colors.neutral["400"],
      gentle: colors.neutral["800"],
      //muted: colors.neutral["800"],
      invert: colors.neutral["50"],
      button: colors.neutral["50"],
      focus: colors.accent["300"],
    },
    alert: {
      error: colors.alert.error["300"],
      warn: colors.alert.warn["300"],
      info: colors.alert.info["300"],
      success: colors.alert.success["300"],
    },
    category: {
      red: colors.category.red["300"],
      orange: colors.category.orange["300"],
      yellow: colors.category.yellow["300"],
      green: colors.category.green["300"],
      cyan: colors.category.cyan["300"],
      blue: colors.category.blue["300"],
      violet: colors.category.violet["300"],
    },
  },
})
