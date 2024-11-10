export interface ColorValue {
  mode: "rgb" | "hsl"
  color: [number, number, number]
  alpha?: number
}
