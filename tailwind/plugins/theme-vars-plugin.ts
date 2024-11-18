import defaultColors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"
import type { CustomThemeConfig } from "tailwindcss/types/config"
import type { DefaultColors } from "tailwindcss/types/generated/colors"

import { ObjDeepPath } from "../../src/types/util-types"
import { Color } from "../../src/utils/color"
import { deepLoop } from "../../src/utils/deep-loop"

interface ThemeItem {
  [key: string]: ThemeItem | string | number
}

type ReadValue<T> = (
  path: ObjDeepPath<T>,
  extra?: `${string}<var>${string}`
) => string

interface CreateThemeProps<TTheme, TTokens> {
  /** Prefix for css variables */
  prefix?: string
  /** The underlying css theme with all possible values.
   *  Will be used to write css variables.
   **/
  theme: TTheme | ((colors: DefaultColors) => TTheme)
  /** Paths pointing to values that should be handled as colors */
  colorPath?: ObjDeepPath<TTheme> | ObjDeepPath<TTheme>[]
  /** Function to retrieve the tokens which are used in tailwind */
  tokens: (get: ReadValue<TTheme>) => TTokens
}

interface CreateThemeResult<TTheme, TTokens> {
  /** Returns the theme that was initially passed to `createTheme` */
  getDefaultTheme: () => TTheme
  /** Returns all css vars and their values */
  getCssVars: (theme?: TTheme) => Record<string, string>
  /** Returns all tokens with the theme's css vars applied */
  getTokens: () => TTokens
  /** Returns a string which applies the according css var */
  get: ReadValue<TTheme>
}

export const createTheme = <
  TTheme extends ThemeItem,
  TTokens extends Partial<CustomThemeConfig>
>({
  prefix = "tw",
  theme: getTheme,
  colorPath = ["color", "colors"] as ObjDeepPath<TTheme>[],
  tokens,
}: CreateThemeProps<TTheme, TTokens>): CreateThemeResult<TTheme, TTokens> => {
  const defaultTheme =
    typeof getTheme === "function" ? getTheme(defaultColors) : getTheme

  const getCssVar = (path: ObjDeepPath<TTheme>) => {
    const varPrefix = prefix ? `--${prefix}-theme` : "--theme"
    return `${varPrefix}-${path.replaceAll(".", "-")}`
  }

  const getCssVars = (theme = defaultTheme) => {
    const cssVars: Record<string, string> = {}

    deepLoop(theme, (itemPath, value) => {
      const varName = getCssVar(itemPath.join("-") as ObjDeepPath<TTheme>)
      try {
        const { color } = new Color(value as string).toHsl().getValue()
        cssVars[varName] = color.join(" ")
      } catch {
        cssVars[varName] = String(value)
      }
    })

    return cssVars
  }

  const isColor = (path: ObjDeepPath<TTheme>) =>
    [colorPath]
      .flat()
      .some(colorPath => path.startsWith(`${colorPath}.`) || path === colorPath)

  const readValue: ReadValue<TTheme> = (path, extra) => {
    let cssVar = `var(${getCssVar(path)})`
    if (isColor(path)) cssVar = `hsl(${cssVar})`
    if (extra) cssVar = extra.replaceAll("<var>", cssVar)
    return cssVar
  }
  const getTokens = () => tokens(readValue)

  return {
    getDefaultTheme: () => defaultTheme,
    getCssVars,
    getTokens,
    get: readValue,
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export const themeVarsPlugin = plugin.withOptions<{
  /** The theme that should be used. Must be created with `createTheme`. */
  theme: CreateThemeResult<any, any>
  /** Merging strategy of the theme tokens.
   *  - "replace" will overwrite the original tailwind theme tokens
   *  - "extend" will add the tokens alongside to the tailwind theme tokens
   **/
  strategy?: "replace" | "extend"
}>(
  ({ theme }) =>
    ({ addBase }) => {
      addBase({
        ":root": theme.getCssVars(),
      })
    },

  ({ theme, strategy }) => {
    const tokens = theme.getTokens() as Partial<CustomThemeConfig>
    if (strategy === "replace") return { theme: tokens }
    return { theme: { extend: tokens } }
  }
)
