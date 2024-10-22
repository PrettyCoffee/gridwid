/**
 * Color Parser
 * Sourced from Tailwind
 * Reference: https://github.com/tailwindlabs/tailwindcss/blob/main/src/util/color.js
 **/

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

interface Color {
  mode: "rgb" | "hsl"
  color: [string, string, string]
  alpha?: string
}

const parseHex = (value: string): Color | null => {
  const match = value
    .replace(SHORT_HEX, (_, r, g, b, a) => {
      const hex = ["#", r, r, g, g, b, b]
      if (a) hex.push(a, a)
      return hex.join("")
    })
    .match(HEX)

  if (!match) return null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, r, g, b, a] = match.map(value => parseInt(value, 16))
  return {
    mode: "rgb",
    color: [String(r), String(g), String(b)],
    alpha: a ? String(a / 255) : undefined,
  }
}

const parseRgb = (value: string): Color | null => {
  const match = value.match(RGB)
  if (!match) return null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, r, g, b, a] = match
  return {
    mode: "rgb",
    color: [String(r), String(g), String(b)],
    alpha: a,
  }
}

const parseHsl = (value: string): Color | null => {
  const match = value.match(HSL)
  if (!match) return null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, h, s, l, a] = match
  return {
    mode: "hsl",
    color: [String(h), String(s), String(l)],
    alpha: a,
  }
}

export const parseColor = (value: string) => {
  const trimmed = value.trim()
  return parseHex(trimmed) ?? parseRgb(trimmed) ?? parseHsl(trimmed)
}
