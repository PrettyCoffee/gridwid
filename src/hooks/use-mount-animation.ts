import { useCallback, useEffect, useRef, useState } from "react"

import { useMediaQuery } from "./use-media-query"

export type MountAnimationState =
  | "init-open"
  | "to-open"
  | "open"
  | "init-close"
  | "to-close"
  | "close"

interface MountAnimationProps {
  open: boolean
  duration: number | [number, number]
  onChange?: (state: MountAnimationState) => void
}

export const useMountAnimation = ({
  open,
  duration,
  onChange,
}: MountAnimationProps) => {
  const allowMotion = useMediaQuery("(prefers-reduced-motion: no-preference)")
  const didMount = useRef(false)
  const [state, setState] = useState<MountAnimationState>(
    open ? "open" : "close"
  )

  const durations = [duration].flat()
  const enterDuration = durations[0]
  const leaveDuration = durations[1] ?? durations[0]

  const updateState = useCallback(
    (state: MountAnimationState) => {
      onChange?.(state)
      setState(state)
    },
    [onChange]
  )

  // eslint-disable-next-line complexity -- extracting anything here would resolve in too much argument passing
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }

    if (!allowMotion) {
      updateState(open ? "open" : "close")
      return
    }

    let timeout: number

    switch (state) {
      case "open":
        if (!open) updateState("init-close")
        break
      case "init-close":
        timeout = window.setTimeout(() => updateState("to-close"), 1)
        break
      case "to-close":
        timeout = window.setTimeout(() => updateState("close"), leaveDuration)
        break

      case "close":
        if (open) updateState("init-open")
        break
      case "init-open":
        timeout = window.setTimeout(() => updateState("to-open"), 1)
        break
      case "to-open":
        timeout = window.setTimeout(() => updateState("open"), enterDuration)
        break
    }

    return () => clearTimeout(timeout)
  }, [open, state, allowMotion, enterDuration, leaveDuration, updateState])

  return {
    state,
    entering: state.includes("open"),
    leaving: state.includes("close"),
    mounted: state !== "close",
  }
}
