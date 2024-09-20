import { create } from "@storybook/theming"

import { colors } from "../tailwind/colors"

const background = colors.background.DEFAULT
const page = colors.background.page

const text = colors.text.DEFAULT
const textMuted = colors.text.gentle
const border = colors.stroke.DEFAULT
const borderMuted = colors.stroke.gentle

const primary = colors.background.highlight
const secondary = colors.background.highlight + "50"

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
