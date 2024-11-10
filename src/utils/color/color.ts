import { hslToRgb } from "./hsl-to-rgb"
import { parseColor } from "./parse-color"
import { rgbToHsl } from "./rgb-to-hsl"
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
    if (mode === "rgb") return this
    return new Color({
      mode: "rgb",
      color: hslToRgb(...color),
      alpha,
    })
  }

  public toHsl() {
    const { mode, color, alpha } = this.value
    if (mode === "hsl") return this
    return new Color({
      mode: "hsl",
      color: rgbToHsl(...color),
      alpha,
    })
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
    }
  }
}
