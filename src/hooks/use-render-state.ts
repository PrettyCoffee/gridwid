import { useRef } from "react"

export const useRenderState = () => {
  const renderState = useRef<"initial" | "didMount">(undefined)
  if (renderState.current == null) {
    renderState.current = "initial"
  } else {
    renderState.current = "didMount"
  }
  return renderState
}
