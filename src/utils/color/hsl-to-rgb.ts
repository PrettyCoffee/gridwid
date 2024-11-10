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
