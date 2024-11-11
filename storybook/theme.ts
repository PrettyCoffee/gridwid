import { create } from "@storybook/theming"

import { theme as appTheme } from "../tailwind/theme"

const color = appTheme.getDefaultTheme().color

const background = color.neutral[900]
const page = color.neutral[950]

const text = color.neutral[200]
const textMuted = color.neutral[400]
const border = color.neutral[400]
const borderMuted = color.neutral[800]

const primary = color.accent
const secondary = color.accent + "50"

export const theme = create({
  base: "dark",
  brandTitle: "Gridwid",

  gridCellSize: 32,

  // app
  appBg: background,
  appContentBg: background,
  appPreviewBg: page,
  appBorderColor: borderMuted,
  appBorderRadius: 8,

  // font
  fontBase: "Quicksand, Inter, sans-serif",
  fontCode: "MonoLisa, 'Fira Code', monospace",
  textColor: text,
  textMutedColor: textMuted,
  textInverseColor: background,

  // colors
  colorPrimary: primary,
  colorSecondary: secondary,

  // bar
  barBg: background,
  barTextColor: text,
  barHoverColor: primary,
  barSelectedColor: primary,

  // inputs
  buttonBg: page,
  buttonBorder: borderMuted,
  booleanBg: page,
  booleanSelectedBg: primary,
  inputBg: background,
  inputTextColor: text,
  inputBorder: border,
  inputBorderRadius: 4,
})
