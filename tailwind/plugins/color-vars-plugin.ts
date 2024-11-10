import defaultColors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"

import { deepLoop } from "../../src/utils/deep-loop"
import { objectPath } from "../../src/utils/object-path"
import { parseColor } from "../../src/utils/parse-color"

const getVarName = (path: string[], prefix: string | undefined) => {
  let varName = "-"
  if (prefix) varName += `-${prefix}`
  varName += `-${path.filter(key => key !== "DEFAULT").join("-")}`
  return varName
}

interface ConfigItem {
  [key: string]: string | ConfigItem
}

const setPath = (
  config: ConfigItem,
  path: string[],
  value: ConfigItem | string
) =>
  // @ts-expect-error -- value cannot be inferred here since keys are used dynamically
  objectPath.set(config, path.join("."), value)

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

        deepLoop(colors, (itemPath, value) => {
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
      let pluginConfig: ConfigItem = {}

      deepLoop(colors, (itemPath, value) => {
        const varName = getVarName(itemPath, prefix)
        const color = parseColor(value)

        const newValue = !color ? value : `${color.mode}(var(${varName}))`
        const path = [...basePath, ...itemPath]
        pluginConfig = setPath(pluginConfig, path, newValue)
      })

      return pluginConfig
    }
  )
