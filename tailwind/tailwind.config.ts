import typographyPlugin from "@tailwindcss/typography"
import { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import animatePlugin from "tailwindcss-animate"

import { bgLayerPlugin } from "./bg-layer-plugin"
import { screens } from "./breakpoints"
import { colorVarsPlugin } from "./color-vars-plugin"
import { colors } from "./colors"
import { shadowPlugin } from "./shadow-plugin"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Quicksand", ...fontFamily.sans],
      body: ["Quicksand", ...fontFamily.sans],
      mono: ["Fira Code", ...fontFamily.mono],
    },
    screens,
    colors: {},

    // Remove default box shadows
    boxShadow: {},
    boxShadowColor: {},

    extend: {
      transitionTimingFunction: {
        bounce: "cubic-bezier(.47,1.64,.41,.8)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    colorVarsPlugin({ prefix: "twc", colors }),
    typographyPlugin(),
    animatePlugin,
    bgLayerPlugin(),
    shadowPlugin(),
  ],
} satisfies Config
