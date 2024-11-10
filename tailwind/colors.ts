import { red, yellow, green, blue, zinc, rose } from "tailwindcss/colors"

const colorValues = {
  neutral: {
    1: zinc[950],
    2: zinc[900],
    3: zinc[800],
    4: zinc[400],
    5: zinc[200],
    6: zinc[50],
  },
  primary: rose[300],
} as const

const colorTokens = {
  highlight: colorValues.primary,
  background: {
    page: colorValues.neutral["1"],
    DEFAULT: colorValues.neutral["2"],
    invert: colorValues.neutral["6"],
    button: colorValues.neutral["6"],
  },
  text: {
    priority: colorValues.neutral["6"],
    DEFAULT: colorValues.neutral["5"],
    gentle: colorValues.neutral["4"],
    invert: colorValues.neutral["1"],
    button: colorValues.neutral["1"],
  },
  stroke: {
    DEFAULT: colorValues.neutral["4"],
    gentle: colorValues.neutral["3"],
    invert: colorValues.neutral["1"],
    button: colorValues.neutral["6"],
    focus: colorValues.primary,
  },
  alert: {
    error: red[400],
    warn: yellow[400],
    info: blue[400],
    success: green[400],
  },
}

const utilityColors = {
  black: { DEFAULT: "black" },
  white: { DEFAULT: "white" },
  transparent: { DEFAULT: "transparent" },
  current: { DEFAULT: "currentColor" },
  inherit: { DEFAULT: "inherit" },
} as const

export const colors = {
  ...utilityColors,
  ...colorTokens,
}
