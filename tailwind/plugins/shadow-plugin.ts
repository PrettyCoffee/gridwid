import plugin from "tailwindcss/plugin"

/** Inspired by Josh W. Comeau's shadow palette generator
 *  @see https://www.joshwcomeau.com/css/introducing-shadow-palette-generator/
 **/

//const defaultColor = "hsla(230deg 52% 7% / 0.25)"
const defaultColor = "hsla(230deg 52% 0% / 0.25)"
const shadeColor = "--shade-color"

const createColors = (defaultColor: string) => {
  const shadeColorValue = `var(${shadeColor}, ${defaultColor})`

  const lowElevation = `
    0 0.1px 0.1px ${shadeColorValue},
    0 0.6px 0.7px -0.4px ${shadeColorValue},
    0 1.2px 1.4px -0.7px ${shadeColorValue},
    0 2px 2.3px -1.1px ${shadeColorValue},
    0 3.2px 3.6px -1.4px ${shadeColorValue},
    0 4.9px 5.5px -1.8px ${shadeColorValue},
    0 7.5px 8.4px -2.1px ${shadeColorValue},
    0 11.1px 12.5px -2.5px ${shadeColorValue}
  `
  const mediumElevation = `
    0 0.2px 0.2px ${shadeColorValue},
    0 1.5px 1.7px -0.4px ${shadeColorValue},
    0 2.8px 3.2px -0.7px ${shadeColorValue},
    0 4.6px 5.2px -1.1px ${shadeColorValue},
    0 7.3px 8.2px -1.4px ${shadeColorValue},
    0 11.5px 12.9px -1.8px ${shadeColorValue},
    0 17.5px 19.7px -2.1px ${shadeColorValue},
    0 25.7px 28.9px -2.5px ${shadeColorValue}
  `
  const highElevation = `
    0 0.5px 0.6px ${shadeColorValue},
    0 3px 3.4px -0.4px ${shadeColorValue},
    0 5.7px 6.4px -0.7px ${shadeColorValue},
    0 9.4px 10.6px -1.1px ${shadeColorValue},
    0 15px 16.9px -1.4px ${shadeColorValue},
    0 23.5px 26.4px -1.8px ${shadeColorValue},
    0 35.8px 40.3px -2.1px ${shadeColorValue},
    0 52.7px 59.3px -2.5px ${shadeColorValue}
  `

  return { lowElevation, mediumElevation, highElevation }
}

interface ShadePluginOptions {
  colors: {
    [key: string]: string
    default: string
  }
}

const defaultOptions: ShadePluginOptions = {
  colors: {
    default: defaultColor,
    dark: "hsla(0deg 0% 0% / 0.25)",
    light: "hsla(0deg 0% 50% / 0.25)",
  },
}

// eslint-disable-next-line @typescript-eslint/no-invalid-void-type
export const shadowPlugin = plugin.withOptions<ShadePluginOptions | void>(
  ({ colors } = defaultOptions) =>
    ({ matchUtilities }) => {
      const { lowElevation, mediumElevation, highElevation } = createColors(
        colors.default
      )

      /* Needs more testing
      const themeColors = flattenObject(theme("colors") ?? {})
      const adjustedColors = Object.fromEntries(
        Object.entries(themeColors).map(([key, value]) => [
          key,
          alphaMix(value as string, 25),
        ])
      )
      */

      matchUtilities(
        {
          "shade-color": value => ({
            [shadeColor]: value,
          }),
        },
        { values: colors }
      )

      matchUtilities(
        {
          shade: value => ({
            boxShadow: value,
          }),
        },
        {
          values: {
            low: lowElevation,
            medium: mediumElevation,
            high: highElevation,
          },
        }
      )
    }
)
