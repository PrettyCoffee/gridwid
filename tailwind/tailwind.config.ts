import typographyPlugin from "@tailwindcss/typography"
import { Config } from "tailwindcss"
import twTheme from "tailwindcss/defaultTheme.js"
import animatePlugin from "tailwindcss-animate"

import { screens } from "./breakpoints"
import { bgLayerPlugin } from "./plugins/bg-layer-plugin"
import { shadowPlugin } from "./plugins/shadow-plugin"
import { themeVarsPlugin } from "./plugins/theme-vars-plugin"
import { theme } from "./theme"

export default {
  darkMode: "selector",
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Quicksand", ...twTheme.fontFamily.sans],
      body: ["Quicksand", ...twTheme.fontFamily.sans],
      mono: ["Fira Code", ...twTheme.fontFamily.mono],
    },
    screens,

    // Remove defaults
    boxShadow: {},
    boxShadowColor: {},

    extend: {
      transitionTimingFunction: {
        bounce: "cubic-bezier(.47,1.64,.41,.8)",
      },
    },
  },
  plugins: [
    themeVarsPlugin({ theme, strategy: "replace" }),
    typographyPlugin(),
    animatePlugin,
    bgLayerPlugin({
      colors: {
        b: theme.read("color.black"),
        w: theme.read("color.white"),
      },
    }),
    shadowPlugin({
      colors: {
        default: `color-mix(in srgb, ${theme.read("color.shadow")} 25%, transparent)`,
      },
    }),
  ],
} satisfies Config
