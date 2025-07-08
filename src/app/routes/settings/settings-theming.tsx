import { useId } from "react"

import { css } from "goober"

import { Card } from "components/ui/card"
import { themePreferences } from "features/theming/theme-data"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"
import { vstack } from "utils/styles"

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
  const id = "border-radius-" + useId()
  const radius = useAtomValue(themePreferences.selectors.getRadius)
  return (
    <Card
      title="Border Radius"
      description="Adjust the border radius size of all elements."
    >
      <div className={vstack({})}>
        <input
          className={cn(slider, "text-text-priority")}
          id={id}
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

const SettingsThemingRoute = () => (
  <div className={cn(vstack({ gap: 2 }))}>
    <BorderRadiusSlider />
  </div>
)

export default SettingsThemingRoute
