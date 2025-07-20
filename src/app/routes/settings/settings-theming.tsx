import { css } from "goober"
import { Check } from "lucide-react"

import { Card } from "components/ui/card"
import { Icon } from "components/ui/icon"
import { VisuallyHidden } from "components/utility/visually-hidden"
import { themePreferences } from "features/theming/theme-data"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { theme } from "../../../../tailwind/theme"

const trackStyles = `
  background: ${theme.read("color.stroke.default")};
  height: var(--track-width);
  border-radius: 50vh;
`

const thumbStyles = `
  appearance: none;
  height: var(--slider-size);
  width: var(--slider-size);
  background: ${theme.read("color.background.default")};
  outline: var(--track-width) solid ${theme.read("color.stroke.button")};
  margin-top: -0.4rem;
  border-radius: 50%;
  border: none;
`

const slider = css`
  --track-width: 0.125rem;
  --slider-size: 1rem;

  appearance: none;
  display: inline-block;
  background: transparent;
  cursor: pointer;
  height: 2rem;
  border-radius: 0.25rem;

  &::-moz-range-track {
    ${trackStyles}
  }
  &::-moz-range-thumb {
    ${thumbStyles}
  }

  input[type="range"]& {
    &::-webkit-slider-runnable-track {
      ${trackStyles}
    }
    &::-webkit-slider-thumb {
      ${thumbStyles}
    }
  }
`

const BorderRadiusSlider = () => {
  const radius = useAtomValue(themePreferences.selectors.getRadius)
  return (
    <Card
      title="Border Radius"
      description="Adjust the border radius size of all elements."
    >
      <div className={vstack({})}>
        <input
          className={cn(slider, "text-text-priority")}
          type="range"
          value={radius}
          min={0}
          max={24}
          onChange={({ currentTarget }) =>
            themePreferences.actions.setRadius(Number(currentTarget.value))
          }
        />
        {radius}
      </div>
    </Card>
  )
}

const colors: Parameters<typeof theme.getCssVar>[0][] = [
  "color.category.red",
  "color.category.orange",
  "color.category.yellow",
  "color.category.green",
  "color.category.cyan",
  "color.category.blue",
  "color.category.violet",
  "color.text.priority",
]

interface ColorButtonProps {
  color: (typeof colors)[number]
  current: string
}
const ColorButton = ({ color, current }: ColorButtonProps) => (
  <button
    onClick={() => themePreferences.actions.setAccent(color)}
    style={{ color: theme.read(color) }}
    className={cn(
      hstack({ align: "center", justify: "center", inline: true }),
      "bgl-base-current hover:bgl-layer-b/10 active:bgl-layer-b/20 size-8 rounded-md cursor-pointer"
    )}
  >
    <VisuallyHidden>{color}</VisuallyHidden>
    {current === color && <Icon icon={Check} color="invert" size="sm" />}
  </button>
)

const AccentColor = () => {
  const accent = useAtomValue(themePreferences.selectors.getAccent)
  return (
    <Card
      title="Accent color"
      description="Change the accent color which highlights focused and active elements."
    >
      <div className={hstack({ gap: 2 })}>
        {colors.map(color => (
          <ColorButton key={color} color={color} current={accent} />
        ))}
      </div>
    </Card>
  )
}

const SettingsThemingRoute = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <AccentColor />
    <BorderRadiusSlider />
  </div>
)

export default SettingsThemingRoute
