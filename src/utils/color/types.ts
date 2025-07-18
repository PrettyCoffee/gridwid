export interface ColorValue {
  mode: "rgb" | "hsl" | "oklch"
  color: [number, number, number]
  alpha?: number
}
