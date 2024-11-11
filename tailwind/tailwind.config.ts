import typographyPlugin from "@tailwindcss/typography"
import { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import animatePlugin from "tailwindcss-animate"

import { screens } from "./breakpoints"
import { bgLayerPlugin } from "./plugins/bg-layer-plugin"
import { shadowPlugin } from "./plugins/shadow-plugin"
import { themeVarsPlugin } from "./plugins/theme-vars-plugin"
import { theme } from "./theme"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Quicksand", ...fontFamily.sans],
      body: ["Quicksand", ...fontFamily.sans],
      mono: ["Fira Code", ...fontFamily.mono],
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
    bgLayerPlugin(),
    shadowPlugin(),
  ],
} satisfies Config
