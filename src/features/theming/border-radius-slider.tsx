import { useId } from "react"

import { useAtomValue } from "lib/yaasl"

import { themePreferences } from "./theme-data"

export const BorderRadiusSlider = () => {
  const id = "border-radius-" + useId()
  const radius = useAtomValue(themePreferences.selectors.getRadius)
  return (
    <>
      <label htmlFor={id}>Border Radius</label>
      <input
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
    </>
  )
}
