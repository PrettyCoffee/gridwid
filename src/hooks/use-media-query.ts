import { useRef, useSyncExternalStore } from "react"

export const useMediaQuery = (query: string) => {
  const mediaQueryList = useRef(window.matchMedia(query))
  return useSyncExternalStore(
    listen => {
      mediaQueryList.current.addEventListener("change", listen)
      return () => mediaQueryList.current.removeEventListener("change", listen)
    },
    () => mediaQueryList.current.matches
  )
}
