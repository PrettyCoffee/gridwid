import { red, yellow, green, blue, zinc, sky, rose } from "tailwindcss/colors"

const themeExtension = {
  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },
    destructive: {
      DEFAULT: "hsl(var(--destructive))",
      foreground: "hsl(var(--destructive-foreground))",
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))",
    },
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))",
    },
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
}

const colorValues = {
  neutral: {
    1: zinc[950],
    2: zinc[900],
    3: zinc[800],
    4: zinc[400],
    5: zinc[200],
    6: zinc[50],
  },
  primary: rose[500],
  primaryText: rose[300],
  secondary: sky[500],
  secondaryText: sky[300],
} as const

const colorTokens = {
  background: {
    DEFAULT: colorValues.neutral["2"],
    page: colorValues.neutral["1"],
    surface: colorValues.neutral["6"],
    highlight: colorValues.primary,
    marked: colorValues.secondary,
  },
  text: {
    DEFAULT: colorValues.neutral["5"],
    priority: colorValues.neutral["6"],
    gentle: colorValues.neutral["4"],
    surface: colorValues.neutral["1"],
    highlight: colorValues.primaryText,
    marked: colorValues.secondaryText,
  },
  stroke: {
    DEFAULT: colorValues.neutral["4"],
    gentle: colorValues.neutral["3"],
    highlight: colorValues.primaryText,
    marked: colorValues.secondaryText,
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
  ...themeExtension.colors,
  ...utilityColors,
  ...colorTokens,
}
