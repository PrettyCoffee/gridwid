import { parseColor } from "./parse-color"
import { ColorValue } from "./types"

const hslToRgb = (
  h: number,
  s: number,
  l: number
): ColorValue["color"] => {
  const a = s * Math.min(l, 1 - l)
  const f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  return [f(0) * 255, f(8) * 255, f(4) * 255]
}

/**
 * rgb to oklch conversion
 * Sourced from Github Gist
 * Reference: https://gist.github.com/ronniebasak/e5331e54cf9414ab0fec23b4f6a27e2a
 **/
const rgbToOklch = (...rgb: ColorValue["color"]): ColorValue["color"] => {
  // Step 1: Convert RGB to Linear RGB
  const r = rgb[0] / 255;
  const g = rgb[1] / 255;
  const b = rgb[2] / 255;

  const linearRgb = {
    r: r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4),
    g: g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4),
    b: b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4),
  };

  // Step 2: Linear RGB to XYZ
  const x = 0.4124 * linearRgb.r + 0.3576 * linearRgb.g + 0.1805 * linearRgb.b;
  const y = 0.2126 * linearRgb.r + 0.7152 * linearRgb.g + 0.0722 * linearRgb.b;
  const z = 0.0193 * linearRgb.r + 0.1192 * linearRgb.g + 0.9505 * linearRgb.b;

  // Step 3: XYZ to Lab
  const xn = 0.95047;
  const yn = 1.0;
  const zn = 1.08883;

  const xNorm = x / xn;
  const yNorm = y / yn;
  const zNorm = z / zn;

  const fx = xNorm > 0.008856 ? Math.pow(xNorm, 1 / 3) : 7.787 * xNorm + 16 / 116;
  const fy = yNorm > 0.008856 ? Math.pow(yNorm, 1 / 3) : 7.787 * yNorm + 16 / 116;
  const fz = zNorm > 0.008856 ? Math.pow(zNorm, 1 / 3) : 7.787 * zNorm + 16 / 116;

  const l = 116 * fy - 16;
  const a = 500 * (fx - fy);
  const bLab = 200 * (fy - fz);

  // Step 4: Lab to LCH
  const c = Math.sqrt(Math.pow(a, 2) + Math.pow(bLab, 2));
  let h = Math.atan2(bLab, a) * (180 / Math.PI);
  if (h < 0) {
    h += 360;
  }

  return [
    l / 100,  // Normalized to 0-1 range
    c / 100,  // Normalized to 0-1 range (though max varies)
    h         // Hue in degrees (0-360)
  ];
}

export const toOklch = (colorValue: ColorValue | string | null): ColorValue => {
  if (!colorValue) {
    throw new Error("Could not convert color to oklch")
  }
  if (typeof colorValue === "string") {
    return toOklch(parseColor(colorValue))
  }

  const { mode, color, alpha } = colorValue
  switch (mode) {
    case "hsl":
      // Convert via hsl -> rgb -> oklch
      return toOklch({ mode: "rgb", color: hslToRgb(...color), alpha })
    case "rgb":
      return { mode: "oklch", color: rgbToOklch(...color), alpha }
    case "oklch":
      return { mode, color, alpha }
    default:
      return toOklch(null)
  }
}
