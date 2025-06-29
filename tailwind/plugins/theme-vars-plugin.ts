import defaultColors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"
import type { CSSRuleObject, CustomThemeConfig } from "tailwindcss/types/config"
import type { DefaultColors } from "tailwindcss/types/generated/colors"

import { ObjDeepPath, ObjDeepValue } from "../../src/types/util-types"
import { Color } from "../../src/utils/color"
import { deepLoop } from "../../src/utils/deep-loop"

interface ThemeItem {
  [key: string]: ThemeItem | string | number
}

type LoosenValues<T> = T extends object
  ? {
      [K in keyof T]: LoosenValues<T[K]>
    }
  : T extends string
    ? string
    : T extends number
      ? number
      : T

type ReadValue<T> = (
  path: ObjDeepPath<T>,
  extra?: `${string}<var>${string}`
) => string

type CreateTheme<TTheme> =
  | TTheme
  | ((colors: LoosenValues<DefaultColors>) => TTheme)

type CreateTokens<TTheme, TTokens> = (get: ReadValue<TTheme>) => TTokens

interface CreateThemeVariant<TTheme, TTokens> {
  /** The underlying css theme with all possible values.
   *  Will be used to write css variables.
   **/
  theme: CreateTheme<TTheme>
  /** Function to retrieve the tokens which are used in tailwind */
  tokens: CreateTokens<TTheme, TTokens>
}

interface GeneralThemeOptions<TTheme> {
  /** Prefix for css variables */
  prefix: string
  /** Paths pointing to values that should be handled as colors */
  colorPath: ObjDeepPath<TTheme> | ObjDeepPath<TTheme>[]
}
interface ThemeConstructorProps<TTheme, TTokens>
  extends Partial<GeneralThemeOptions<TTheme>>,
    CreateThemeVariant<TTheme, TTokens> {}

const getCssVar = <TTheme>(prefix: string, path: ObjDeepPath<TTheme>) => {
  const varPrefix = prefix ? `--${prefix}-theme` : "--theme"
  return `${varPrefix}-${path.replaceAll(".", "-")}`
}

const readVar = <TTheme>(
  { prefix, colorPath }: GeneralThemeOptions<TTheme>,
  path: ObjDeepPath<TTheme>,
  extra?: `${string}<var>${string}`
) => {
  const isColor = [colorPath]
    .flat()
    .some(colorPath => path.startsWith(`${colorPath}.`) || path === colorPath)

  let cssVar = `var(${getCssVar(prefix, path)})`
  if (isColor) cssVar = `hsl(${cssVar})`
  if (extra) cssVar = extra.replaceAll("<var>", cssVar)
  return cssVar
}

const resolveTheme = <TTheme>(createTheme: CreateTheme<TTheme>): TTheme =>
  createTheme instanceof Function ? createTheme(defaultColors) : createTheme

const resolveTokens = <TTheme, TTokens>(
  options: GeneralThemeOptions<TTheme>,
  createTokens: CreateTokens<TTheme, TTokens>
): TTokens => createTokens((path, extra) => readVar(options, path, extra))

class Theme<
  TTheme extends ThemeItem = ThemeItem,
  TTokens extends Partial<CustomThemeConfig> = Partial<CustomThemeConfig>,
> {
  public readonly options: GeneralThemeOptions<TTheme>

  public readonly defaultTheme: TTheme
  public readonly variants: Record<string, TTheme> = {}
  public readonly tokens: TTokens

  constructor({
    prefix = "tw",
    colorPath = ["color", "colors"] as ObjDeepPath<TTheme>[],
    theme,
    tokens,
  }: ThemeConstructorProps<TTheme, TTokens>) {
    this.options = {
      prefix,
      colorPath,
    }

    this.defaultTheme = resolveTheme(theme)
    this.tokens = resolveTokens(this.options, tokens)
  }

  public addVariant(name: string, theme: CreateTheme<TTheme>) {
    this.variants[name] = resolveTheme(theme)
  }

  public read(path: ObjDeepPath<TTheme>, extra?: `${string}<var>${string}`) {
    return readVar<TTheme>(this.options, path, extra)
  }

  public write<TPath extends ObjDeepPath<TTheme>>(
    path: TPath,
    value: ObjDeepValue<TTheme, TPath>
  ) {
    const cssVar = getCssVar<TTheme>(this.options.prefix, path)
    return [cssVar, String(value)] as const
  }
}

export const createTheme = <
  TTheme extends ThemeItem,
  TTokens extends Partial<CustomThemeConfig>,
>(
  props: ThemeConstructorProps<TTheme, TTokens>
) => new Theme(props)

const getCssVars = (theme: Theme, variantName?: string) => {
  const cssVars: Record<string, string> = {}

  const themeVariant = variantName
    ? theme.variants[variantName]
    : theme.defaultTheme

  if (!themeVariant)
    throw new Error(`Theme variant "${variantName}" doesn't exist.`)

  deepLoop(themeVariant, (itemPath, value) => {
    const varName = getCssVar<ThemeItem>(
      theme.options.prefix,
      itemPath.join(".")
    )
    try {
      const { color } = new Color(value as string).toHsl().getValue()
      cssVars[varName] = color.join(" ")
    } catch {
      cssVars[varName] = String(value)
    }
  })

  return cssVars
}

export const themeVarsPlugin = plugin.withOptions<{
  /** The theme that should be used. Must be created with `createTheme`. */
  theme: Theme
  /** Merging strategy of the theme tokens.
   *  - "replace" will overwrite the original tailwind theme tokens
   *  - "extend" will add the tokens alongside to the tailwind theme tokens
   **/
  strategy?: "replace" | "extend"
}>(
  ({ theme }) =>
    api => {
      const css: Record<string, CSSRuleObject> = {
        ":root": getCssVars(theme),
      }
      Object.keys(theme.variants).forEach(variantName => {
        css[`.${variantName}`] = getCssVars(theme, variantName)
      })
      api.addBase(css)
    },

  ({ theme, strategy }) => {
    if (strategy === "replace") return { theme: theme.tokens }
    return { theme: { extend: theme.tokens } }
  }
)
