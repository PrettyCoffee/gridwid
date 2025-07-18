import { ColorValue } from "./types"

type Color = ColorValue["color"]
type Matrice = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
]

const toColor = ([v1, v2, v3]: number[]): Color => {
  if (v1 == null || v2 == null || v3 == null) {
    throw new Error(
      "Something went wrong while converting a color to or from oklch."
    )
  }
  return [v1, v2, v3]
}

const multiplyMatrices = (A: Matrice, B: Color): Color => [
  A[0] * B[0] + A[1] * B[1] + A[2] * B[2],
  A[3] * B[0] + A[4] * B[1] + A[5] * B[2],
  A[6] * B[0] + A[7] * B[1] + A[8] * B[2],
]

const oklchToOklab = ([l, c, h]: Color): Color => [
  l,
  Number.isNaN(h) ? 0 : c * Math.cos((h * Math.PI) / 180),
  Number.isNaN(h) ? 0 : c * Math.sin((h * Math.PI) / 180),
]
const oklabToOklch = ([l, a, b]: Color): Color => [
  l,
  Math.sqrt(a ** 2 + b ** 2),
  Math.abs(a) < 0.0002 && Math.abs(b) < 0.0002
    ? 0
    : ((((Math.atan2(b, a) * 180) / Math.PI) % 360) + 360) % 360,
]

const rgbToSrgbLinear = (rgb: Color): Color =>
  toColor(
    rgb.map(c =>
      Math.abs(c) <= 0.040_45
        ? c / 12.92
        : (c < 0 ? -1 : 1) * ((Math.abs(c) + 0.055) / 1.055) ** 2.4
    )
  )
const srgbLinearToRgb = (rgb: Color): Color =>
  toColor(
    rgb.map(c =>
      Math.abs(c) > 0.003_130_8
        ? (c < 0 ? -1 : 1) * (1.055 * Math.abs(c) ** (1 / 2.4) - 0.055)
        : 12.92 * c
    )
  )

const oklabToXyz = (lab: Color) => {
  const LMSg = multiplyMatrices(
    [
      1, 0.396_337_777_376_174_9, 0.215_803_757_309_913_6, 1,
      -0.105_561_345_815_658_6, -0.063_854_172_825_813_3, 1,
      -0.089_484_177_529_811_9, -1.291_485_548_019_409_2,
    ],
    lab
  )
  const LMS = toColor(LMSg.map(val => val ** 3))
  return multiplyMatrices(
    [
      1.226_879_875_845_924_3, -0.557_814_994_460_217_1,
      0.281_391_045_665_964_7, -0.040_575_745_214_800_8, 1.112_286_803_280_317,
      -0.071_711_058_065_516_4, -0.076_372_936_674_660_1,
      -0.421_493_332_402_243_2, 1.586_924_019_836_781_6,
    ],
    LMS
  )
}
const xyzToOklab = (xyz: Color) => {
  const LMS = multiplyMatrices(
    [
      0.819_022_437_996_703, 0.361_906_260_052_890_4, -0.128_873_781_520_987_9,
      0.032_983_653_932_388_5, 0.929_286_861_586_343_4, 0.036_144_666_350_642_4,
      0.048_177_189_359_624_2, 0.264_239_531_752_730_8, 0.633_547_828_469_430_9,
    ],
    xyz
  )
  const LMSg = toColor(LMS.map(val => Math.cbrt(val)))
  return multiplyMatrices(
    [
      0.210_454_268_309_314, 0.793_617_774_702_305_4, -0.004_072_043_011_619_3,
      1.977_998_532_431_168_4, -2.428_592_242_048_579_9, 0.450_593_709_617_411,
      0.025_904_042_465_547_8, 0.782_771_712_457_529_6,
      -0.808_675_754_923_077_4,
    ],
    LMSg
  )
}
const xyzToRgbLinear = (xyz: Color) =>
  multiplyMatrices(
    [
      3.240_969_941_904_522_6, -1.537_383_177_570_094, -0.498_610_760_293_003_4,
      -0.969_243_636_280_879_6, 1.875_967_501_507_720_2,
      0.041_555_057_407_175_59, 0.055_630_079_696_993_66,
      -0.203_976_958_888_976_52, 1.056_971_514_242_878_6,
    ],
    xyz
  )
const rgbLinearToXyz = (rgb: Color) =>
  multiplyMatrices(
    [
      0.412_390_799_265_959_34, 0.357_584_339_383_878, 0.180_480_788_401_834_3,
      0.212_639_005_871_510_27, 0.715_168_678_767_756, 0.072_192_315_360_733_71,
      0.019_330_818_715_591_82, 0.119_194_779_794_625_98,
      0.950_532_152_249_660_7,
    ],
    rgb
  )

const round = (value: number, precision: number) =>
  Number.parseFloat(value.toFixed(precision))

export const oklchToRgb = (...[l, c, h]: Color): Color => {
  const [r, g, b] = srgbLinearToRgb(
    xyzToRgbLinear(oklabToXyz(oklchToOklab([l * 100, c, h])))
  )
  return [round(r, 1), round(g, 1), round(b, 1)]
}

export const rgbToOklch = (...rgb: Color): Color => {
  const [l, c, h] = oklabToOklch(
    xyzToOklab(rgbLinearToXyz(rgbToSrgbLinear(rgb)))
  )
  return [l, c, h % 360]
}
