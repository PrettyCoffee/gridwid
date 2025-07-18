import { hslToRgb, rgbToHsl } from "./hsl-rgb"
import { oklchToRgb, rgbToOklch } from "./oklch-rgb"
import { parseColor } from "./parse-color"
import { ColorValue } from "./types"

export class Color {
  private value: ColorValue

  constructor(color: ColorValue | string) {
    const value = typeof color === "string" ? parseColor(color) : color
    if (!value) throw new Error("Color could not be parsed")
    this.value = value
  }

  public toRgb() {
    const { mode, color, alpha } = this.value

    switch (mode) {
      case "hsl":
        return new Color({
          mode: "rgb",
          color: hslToRgb(...color),
          alpha,
        })

      case "oklch":
        return new Color({
          mode: "rgb",
          color: oklchToRgb(...color),
          alpha,
        })

      default:
        return this
    }
  }

  public toHsl() {
    const { mode, color, alpha } = this.value

    switch (mode) {
      case "rgb":
        return new Color({
          mode: "hsl",
          color: rgbToHsl(...color),
          alpha,
        })

      case "oklch":
        return new Color({
          mode: "hsl",
          color: oklchToRgb(...rgbToHsl(...color)),
          alpha,
        })

      default:
        return this
    }
  }

  public toOklch() {
    const { mode, color, alpha } = this.value

    switch (mode) {
      case "rgb":
        return new Color({
          mode: "oklch",
          color: rgbToOklch(...color),
          alpha,
        })

      case "hsl":
        return new Color({
          mode: "oklch",
          color: rgbToOklch(...hslToRgb(...color)),
          alpha,
        })

      default:
        return this
    }
  }

  public getValue() {
    return this.value
  }

  public setValue(value: ColorValue) {
    this.value = value
  }

  public toString() {
    const { mode, color, alpha = 1 } = this.value

    switch (mode) {
      case "hsl":
        return alpha === 1
          ? `hsl(${color[0]} ${color[1]} ${color[2]})`
          : `hsla(${color[0]} ${color[1]} ${color[2]} / ${alpha})`

      case "rgb":
        return alpha === 1
          ? `rgb(${color[0]} ${color[1]} ${color[2]})`
          : `rgba(${color[0]} ${color[1]} ${color[2]} / ${alpha})`

      case "oklch":
        return alpha === 1
          ? `oklch(${color[0] * 100}% ${color[1]} ${color[2]})`
          : `oklcha(${color[0] * 100}% ${color[1]} ${color[2]} / ${alpha})`
    }
  }
}
