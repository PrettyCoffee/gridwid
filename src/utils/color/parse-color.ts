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

const parseHex = (value: string): ColorValue | null => {
  const match = value
    .replace(SHORT_HEX, (_, r, g, b, a) => {
      const hex = ["#", r, r, g, g, b, b]
      if (a) hex.push(a, a)
      return hex.join("")
    })
    .match(HEX)

  if (!match) return null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_full, r, g, b, a] = match.map(value => parseInt(value, 16))
  return {
    mode: "rgb",
    color: [r ?? 0, g ?? 0, b ?? 0],
    alpha: a ? a / 255 : undefined,
  }
}

const parseRgb = (value: string): ColorValue | null => {
  const match = value.match(RGB)
  if (!match) return null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_full, _mode, r, g, b, a] = match.map(parseInt)
  return {
    mode: "rgb",
    color: [r ?? 0, g ?? 0, b ?? 0],
    alpha: a,
  }
}

const parseHsl = (value: string): ColorValue | null => {
  const match = value.match(HSL)
  if (!match) return null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_full, _mode, h, s, l, a] = match.map(parseInt)
  return {
    mode: "hsl",
    color: [h ?? 0, s ?? 0, l ?? 0],
    alpha: a,
  }
}

export const parseColor = (value: string) => {
  const trimmed = value.trim()
  return parseHex(trimmed) ?? parseRgb(trimmed) ?? parseHsl(trimmed)
}
