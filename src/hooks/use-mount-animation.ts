import { useCallback, useEffect, useState } from "react"

import { useMediaQuery } from "./use-media-query"
import { useRenderState } from "./use-render-state"

export type MountAnimationState = "to-open" | "open" | "to-close" | "close"

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
  const renderState = useRenderState()
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

  useEffect(() => {
    if (renderState.current === "initial") return

    if (!allowMotion) {
      updateState(open ? "open" : "close")
      return
    }

    let timeout: number
    if (open) {
      updateState("to-open")
      timeout = window.setTimeout(() => updateState("open"), enterDuration)
    } else {
      updateState("to-close")
      timeout = window.setTimeout(() => updateState("close"), leaveDuration)
    }

    return () => clearTimeout(timeout)
  }, [
    allowMotion,
    enterDuration,
    leaveDuration,
    open,
    renderState,
    updateState,
  ])

  return {
    state,
    entering: state.includes("open"),
    leaving: state.includes("close"),
    mounted: state !== "close",
  }
}
