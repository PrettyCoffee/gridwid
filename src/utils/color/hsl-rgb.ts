import { ColorValue } from "./types"

export const hslToRgb = (
  h: number,
  s: number,
  l: number
): ColorValue["color"] => {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  return [f(0) * 255, f(8) * 255, f(4) * 255]
}

export const rgbToHsl = (
  r: number,
  g: number,
  b: number
): ColorValue["color"] => {
  r /= 255
  g /= 255
  b /= 255

  const cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin

  let h = 0,
    s = 0,
    l = 0

  if (delta === 0) h = 0
  else if (cmax === r) h = ((g - b) / delta) % 6
  else if (cmax === g) h = (b - r) / delta + 2
  else h = (r - g) / delta + 4

  h = Math.round(h * 60)
  if (h < 0) h += 360
  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return [h, s, l] as const
}
