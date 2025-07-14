import { create } from "storybook/theming"

import { theme as appTheme } from "../tailwind/theme"

const { color } = appTheme.variants["dark"] ?? appTheme.defaultTokens

const background = color.background.default
const page = color.background.page

const text = color.text.default
const textMuted = color.text.gentle
const border = color.stroke.default
const borderMuted = color.stroke.gentle

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
