/**
 * Color Parser
 * Sourced from Tailwind
 * Reference: https://github.com/tailwindlabs/tailwindcss/blob/main/src/util/color.js
 **/
import { ColorValue } from "./types"

const HEX = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i
const SHORT_HEX = /^#([a-f\d])([a-f\d])([a-f\d])([a-f\d])?$/i
const VALUE = /(?:\d+|\d*\.\d+)%?/
const SEP = /(?:\s*,\s*|\s+)/
const ALPHA_SEP = /\s*[,/]\s*/

const RGB = new RegExp(
  `^(rgba?)\\(\\s*(${VALUE.source})(?:${SEP.source}(${VALUE.source}))(?:${SEP.source}(${VALUE.source}))(?:${ALPHA_SEP.source}(${VALUE.source}))?\\s*\\)$`
)
const HSL = new RegExp(
  `^(hsla?)\\(\\s*((?:${VALUE.source})(?:deg|rad|grad|turn)?)(?:${SEP.source}(${VALUE.source}))(?:${SEP.source}(${VALUE.source}))(?:${ALPHA_SEP.source}(${VALUE.source}))?\\s*\\)$`
)

const OKLCH = new RegExp(
  `^(oklcha?)\\(\\s*(${VALUE.source})(?:${SEP.source}(${VALUE.source}))(?:${SEP.source}(${VALUE.source}))(?:${ALPHA_SEP.source}(${VALUE.source}))?\\s*\\)$`
)

const parseValue = (value: string) => {
  const number = Number.parseFloat(value)
  if (Number.isNaN(number)) return undefined
  return value.includes("%") ? number / 100 : number
}

const parseHex = (value: string): ColorValue | null => {
  const match = HEX.exec(
    value.replace(SHORT_HEX, (_, r, g, b, a) => {
      const hex = ["#", r, r, g, g, b, b]
      if (a) hex.push(a, a)
      return hex.join("")
    })
  )

  if (!match) return null

  const [, r, g, b, a] = match.map(value => Number.parseInt(value, 16))
  return {
    mode: "rgb",
    color: [r ?? 0, g ?? 0, b ?? 0],
    alpha: a && !Number.isNaN(a) ? a / 255 : undefined,
  }
}

const parseRgb = (value: string): ColorValue | null => {
  const match = RGB.exec(value)
  if (!match) return null

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [_full, _mode, r, g, b, a] = match.map(parseValue)
  return {
    mode: "rgb",
    color: [r ?? 0, g ?? 0, b ?? 0],
    alpha: a,
  }
}

const parseHsl = (value: string): ColorValue | null => {
  const match = HSL.exec(value)
  if (!match) return null

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [_full, _mode, h, s, l, a] = match.map(parseValue)
  return {
    mode: "hsl",
    color: [h ?? 0, s ?? 0, l ?? 0],
    alpha: a,
  }
}

const parseOklch = (value: string): ColorValue | null => {
  const match = OKLCH.exec(value)
  if (!match) return null

  // eslint-disable-next-line unused-imports/no-unused-vars
  const [_full, _mode, l, c, h, a] = match.map(parseValue)

  return {
    mode: "oklch",
    color: [l ?? 0, c ?? 0, h ?? 0],
    alpha: a,
  }
}

export const parseColor = (value: string) => {
  const trimmed = value.trim()
  return (
    parseHex(trimmed) ??
    parseRgb(trimmed) ??
    parseHsl(trimmed) ??
    parseOklch(trimmed)
  )
}
