import { Config } from "tailwindcss"
import plugin from "tailwindcss/plugin"

const getKey = (name: string, prefix?: string) => {
  if (name === "DEFAULT") return prefix ?? ""
  if (prefix) return `${prefix}-${name}`
  return name
}

interface Nested {
  [key: string]: string | Nested
}
type Flattened = Record<string, string>
const flattenObject = (value: Nested, prefix?: string) => {
  return Object.entries(value).reduce((result, [name, value]): Flattened => {
    const key = getKey(name, prefix)
    return Object.assign(
      result,
      typeof value === "string" ? { [key]: value } : flattenObject(value, key)
    )
  }, {})
}

const alphaMix = (color: string, alpha: number) => {
  return `color-mix(in srgb, ${color} ${alpha}%, transparent)`
}

const createSteps = (name: string, color: string, steps: number) => {
  const step = 100 / steps
  const alphaLevels = Array.from({ length: steps }, (_, i) =>
    Math.round(i * step)
  )
  return Object.fromEntries(
    alphaLevels.map(alpha => [`${name}/${alpha}`, alphaMix(color, alpha)])
  )
}

const createTransparencies = ({
  colors,
  steps,
}: Required<BgLayerPluginOptions>) =>
  Object.entries(colors).reduce<Record<string, string>>(
    (colors, [name, color]) =>
      Object.assign(colors, createSteps(name, color, steps)),
    {}
  )

interface BgLayerPluginOptions {
  colors?: Record<string, string>
  steps?: number
}

const getVarName = (name: string, { prefix }: Config) =>
  prefix ? `--${prefix}-bgl-${name}` : `--bgl-${name}`

export const bgLayerPlugin = plugin.withOptions<BgLayerPluginOptions | void>(
  ({ colors = { b: "black", w: "white" }, steps = 20 } = {}) =>
    api => {
      const twConfig = api.config()
      const themeColors = flattenObject(api.theme("colors") ?? {})
      const transparencies = createTransparencies({ colors, steps })

      const baseVar = getVarName("base", twConfig)
      const layer1Var = getVarName("layer1", twConfig)

      const baseVal = `var(${baseVar})`
      const layer1Val = `var(${layer1Var},transparent)`

      api.matchUtilities(
        {
          "bgl-base": value => ({
            [baseVar]: value,
            background: `${baseVal} linear-gradient(0,${layer1Val},${layer1Val})`,
          }),
          "bgl-layer": value => ({
            [layer1Var]: value,
          }),
        },
        {
          values: {
            ...themeColors,
            ...transparencies,
          },
        }
      )
    }
)
