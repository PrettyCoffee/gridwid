import defaultColors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

import { parseColor } from "./parseColor"

const getVarName = (path: string[], prefix: string | undefined) => {
  let varName = "-"
  if (prefix) varName += `-${prefix}`
  varName += `-${path.filter(key => key !== "DEFAULT").join("-")}`
  return varName
}

interface ConfigItem {
  [key: string]: string | ConfigItem
}

const isObject = (value: unknown): value is ConfigItem =>
  typeof value === "object" && value != null

const setPath = (
  config: ConfigItem,
  path: string[],
  value: ConfigItem | string
) => {
  const [key, ...rest] = path
  if (!key) return

  if (rest.length === 0) {
    config[key] = value
  } else {
    const obj = config[key] ?? {}
    if (!isObject(obj)) return
    config[key] = obj
    setPath(obj, rest, value)
  }
}

const forEachDeepPath = (
  parent: ConfigItem,
  handler: (path: string[], value: string) => void,
  prevPath: string[] = []
) =>
  Object.entries(parent).forEach(([key, value]) => {
    const path = [...prevPath, key]
    if (typeof value === "string") {
      handler(path, value)
    } else {
      forEachDeepPath(value, handler, path)
    }
  })

interface ColorVarsPluginOptions {
  prefix?: string
  colors?: ConfigItem
}

const defaultOptions = (options?: ColorVarsPluginOptions) => {
  const { prefix, colors } = options ?? {}
  return {
    prefix,
    colors: colors ?? (defaultColors as unknown as ConfigItem),
  }
}

export const colorVarsPlugin =
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  plugin.withOptions<ColorVarsPluginOptions | undefined>(
    options =>
      ({ addBase }) => {
        const { prefix, colors } = defaultOptions(options)

        const vars: Record<string, string> = {}

        forEachDeepPath(colors, (itemPath, value) => {
          const varName = getVarName(itemPath, prefix)
          const color = parseColor(value)
          if (!color) return

          const varValue = color.color.join(" ")
          vars[varName] = varValue
        })

        addBase({
          ":root": vars,
        })
      },

    options => {
      const { prefix, colors } = defaultOptions(options)

      const basePath = ["theme", "extend", "colors"]
      const pluginConfig: ConfigItem = {}

      forEachDeepPath(colors, (itemPath, value) => {
        const varName = getVarName(itemPath, prefix)
        const color = parseColor(value)
        if (!color) {
          setPath(pluginConfig, [...basePath, ...itemPath], value)
          return
        }

        setPath(
          pluginConfig,
          [...basePath, ...itemPath],
          `${color.mode}(var(${varName}))`
        )
      })

      return pluginConfig
    }
  )
