import { useEffect, useState } from "react"

import { useMediaQuery } from "./use-media-query"
import { useRenderState } from "./use-render-state"

export const useMountAnimation = (
  open: boolean,
  duration: number | [number, number]
) => {
  const allowMotion = useMediaQuery("(prefers-reduced-motion: no-preference)")
  const renderState = useRenderState()
  const [state, setState] = useState<"to-open" | "open" | "to-close" | "close">(
    open ? "open" : "close"
  )

  const durations = [duration].flat()
  const enterDuration = durations[0]
  const leaveDuration = durations[1] ?? durations[0]

  useEffect(() => {
    if (renderState.current === "initial") return

    if (!allowMotion) {
      setState(open ? "open" : "close")
      return
    }

    let timeout: number
    if (open) {
      setState("to-open")
      timeout = window.setTimeout(() => setState("open"), enterDuration)
    } else {
      setState("to-close")
      timeout = window.setTimeout(() => setState("close"), leaveDuration)
    }

    return () => clearTimeout(timeout)
  }, [enterDuration, leaveDuration, open, allowMotion, renderState])

  return {
    state,
    entering: state.includes("open"),
    leaving: state.includes("close"),
    mounted: state !== "close",
  }
}
