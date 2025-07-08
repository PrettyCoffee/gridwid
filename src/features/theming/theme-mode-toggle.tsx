import { PropsWithChildren, useEffect, useRef, useState } from "react"

import { css, keyframes } from "goober"
import { Moon, Sun } from "lucide-react"

import { Button } from "components/ui/button"
import { Icon } from "components/ui/icon"
import { TitleTooltip } from "components/ui/tooltip"
import { VisuallyHidden } from "components/utility/visually-hidden"
import { useAtomValue } from "lib/yaasl"
import { cn } from "utils/cn"

import { themePreferences } from "./theme-data"

const animateIn = keyframes`
  from {
    transform: rotate(-90deg);
  } to {
    transform: rotate(90deg);
  }
`

const animateOut = keyframes`
  from {
    transform: rotate(90deg);
  } to {
    transform: rotate(270deg);
  }
`

const getAnimation = ({
  active,
  modeChanged,
}: {
  active: boolean
  modeChanged: boolean
}) => {
  const outer = active ? animateIn : animateOut
  const inner = active ? animateOut : animateIn
  const skipAnimation = modeChanged ? "" : "animation-delay: -1s;"

  return css`
    will-change: transform;
    animation: 1s ${outer} forwards;
    ${skipAnimation}
    svg {
      will-change: transform;
      animation: 1s ${inner} forwards;
      ${skipAnimation}
    }
  `
}

const Axis = ({
  active,
  modeChanged,
  children,
}: PropsWithChildren<{ active: boolean; modeChanged: boolean }>) => (
  <span
    className={cn(
      getAnimation({ active, modeChanged }),
      "absolute -bottom-5 inline-flex w-20 items-center justify-start gap-1 text-left"
    )}
  >
    {children}
  </span>
)

export const ThemeModeToggle = () => {
  const mode = useAtomValue(themePreferences.selectors.getMode)
  const title = mode === "dark" ? "Light mode" : "Dark mode"
  const toggleMode = () =>
    themePreferences.actions.setMode(mode === "dark" ? "light" : "dark")

  const initialMode = useRef(mode)
  const [modeChanged, setModeChanged] = useState(false)
  useEffect(() => {
    if (modeChanged) return
    if (initialMode.current === mode) return
    setModeChanged(true)
  }, [mode, modeChanged])

  return (
    <TitleTooltip title={title} asChild>
      <Button onClick={toggleMode} className="relative size-10 overflow-hidden">
        <VisuallyHidden>{title}</VisuallyHidden>
        <Axis active={mode === "light"} modeChanged={modeChanged}>
          <Icon icon={Sun} />
        </Axis>
        <Axis active={mode === "dark"} modeChanged={modeChanged}>
          <Icon icon={Moon} />
        </Axis>
      </Button>
    </TitleTooltip>
  )
}
