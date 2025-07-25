import { create } from "storybook/theming"

export const theme = create({
  base: "dark",
  brandTitle: "Gridwid",

  gridCellSize: 32,

  // app
  appBorderRadius: 8,

  // font
  fontBase: "Quicksand, Inter, sans-serif",
  fontCode: "MonoLisa, 'Fira Code', monospace",

  // inputs
  inputBorderRadius: 4,
})
