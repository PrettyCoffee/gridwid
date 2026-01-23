import defaultColors from "tailwindcss/colors"
import plugin from "tailwindcss/plugin"
import type { ThemeConfig } from "tailwindcss/plugin.js"

import { ObjDeepPath, ObjDeepValue } from "../../src/types/util-types"
import { parseColor, toOklch } from "../../src/utils/color"
import { deepLoop } from "../../src/utils/deep-loop"

type CustomThemeConfig = ThemeConfig["extend"]
type DefaultColors = typeof defaultColors

interface TokenItem {
  [key: string]: TokenItem | string | number
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

type CreateTokens<TTokens> =
  | TTokens
  | ((colors: LoosenValues<DefaultColors>) => TTokens)

type CreateTwTheme<TTokens, TTwTheme> = (get: ReadValue<TTokens>) => TTwTheme

interface CreateThemeVariant<TTokens, TTwTheme> {
  /** The underlying css theme with all possible values.
   *  Will be used to write css variables.
   **/
  tokens: CreateTokens<TTokens>
  /** Function to retrieve the tokens which are used in tailwind */
  twTheme: CreateTwTheme<TTokens, TTwTheme>
}

interface GeneralThemeOptions<TTokens> {
  /** Prefix for css variables */
  prefix: string
  /** Paths pointing to values that should be handled as colors */
  colorPath: ObjDeepPath<TTokens> | ObjDeepPath<TTokens>[]
}
interface ThemeConstructorProps<TTokens, TTwTheme>
  extends
    Partial<GeneralThemeOptions<TTokens>>,
    CreateThemeVariant<TTokens, TTwTheme> {}

const getCssVar = <TTheme>(prefix: string, path: ObjDeepPath<TTheme>) => {
  const varPrefix = prefix ? `--${prefix}-theme` : "--theme"
  return `${varPrefix}-${path.replaceAll(".", "-")}`
}

const readVar = <TTokens>(
  { prefix, colorPath }: GeneralThemeOptions<TTokens>,
  path: ObjDeepPath<TTokens>,
  extra?: `${string}<var>${string}`
) => {
  const isColor = [colorPath]
    .flat()
    .some(colorPath => path.startsWith(`${colorPath}.`) || path === colorPath)

  let cssVar = `var(${getCssVar(prefix, path)})`
  if (isColor) cssVar = `oklch(${cssVar})`
  if (extra) cssVar = extra.replaceAll("<var>", cssVar)
  return cssVar
}

const resolveTokens = <TTokens>(createTheme: CreateTokens<TTokens>): TTokens =>
  createTheme instanceof Function ? createTheme(defaultColors) : createTheme

const resolveTwTheme = <TTokens, TTwTheme>(
  options: GeneralThemeOptions<TTokens>,
  createTokens: CreateTwTheme<TTokens, TTwTheme>
): TTwTheme => createTokens((path, extra) => readVar(options, path, extra))

class Theme<
  TTokens extends TokenItem = TokenItem,
  TTwTheme extends Partial<CustomThemeConfig> = Partial<CustomThemeConfig>,
> {
  public readonly options: GeneralThemeOptions<TTokens>

  public readonly defaultTokens: TTokens
  public readonly variants: Record<string, LoosenValues<TTokens>> = {}
  public readonly twTheme: TTwTheme

  constructor({
    prefix = "tw",
    colorPath = ["color", "colors"] as ObjDeepPath<TTokens>[],
    tokens,
    twTheme,
  }: ThemeConstructorProps<TTokens, TTwTheme>) {
    this.options = {
      prefix,
      colorPath,
    }

    this.defaultTokens = resolveTokens(tokens)
    this.twTheme = resolveTwTheme(this.options, twTheme)
  }

  public addVariant(name: string, tokens: CreateTokens<LoosenValues<TTokens>>) {
    this.variants[name] = resolveTokens(tokens)
  }

  public getCssVar(path: ObjDeepPath<TTokens>) {
    return getCssVar<TTokens>(this.options.prefix, path)
  }

  public read(path: ObjDeepPath<TTokens>, extra?: `${string}<var>${string}`) {
    return readVar<TTokens>(this.options, path, extra)
  }

  public write<TPath extends ObjDeepPath<TTokens>>(
    path: TPath,
    value: ObjDeepValue<LoosenValues<TTokens>, TPath>
  ) {
    const cssVar = this.getCssVar(path)
    return [cssVar, String(value as string)] as const
  }
}

export const createTheme = <
  TTokens extends TokenItem,
  TTwTheme extends Partial<CustomThemeConfig>,
>(
  props: ThemeConstructorProps<TTokens, TTwTheme>
) => new Theme(props)

const getCssVars = (theme: Theme, variantName?: string) => {
  const cssVars: Record<string, string> = {}

  const themeVariant = variantName
    ? theme.variants[variantName]
    : theme.defaultTokens

  if (!themeVariant)
    throw new Error(`Theme variant "${variantName}" doesn't exist.`)

  deepLoop(themeVariant, (itemPath, value) => {
    const varName = theme.getCssVar(itemPath.join("."))
    try {
      const { color } = toOklch(parseColor(String(value)))
      cssVars[varName] = color.join(" ")
    } catch {
      cssVars[varName] = String(value)
    }
  })

  return cssVars
}

interface ThemeVarsPluginOptions {
  /** The theme that should be used. Must be created with `createTheme`. */
  theme: Theme
  /** Merging strategy of the theme tokens.
   *  - "replace" will overwrite the original tailwind theme tokens
   *  - "extend" will add the tokens alongside to the tailwind theme tokens
   **/
  strategy?: "replace" | "extend"
}

const fallbackOptions: ThemeVarsPluginOptions = {
  theme: createTheme({ tokens: {}, twTheme: () => ({}) }),
  strategy: "extend",
}

interface NestedStringObject {
  [k: string]: NestedStringObject | string
}

export const themeVarsPlugin = plugin.withOptions<ThemeVarsPluginOptions>(
  ({ theme } = fallbackOptions) =>
    api => {
      const css: NestedStringObject = {
        ":root": getCssVars(theme),
      }
      Object.keys(theme.variants).forEach(variantName => {
        css[`.${variantName}`] = getCssVars(theme, variantName)
      })
      api.addBase(css)
    },

  ({ theme, strategy } = fallbackOptions) => {
    if (strategy === "replace") return { theme: theme.twTheme }
    return { theme: { extend: theme.twTheme } }
  }
)
