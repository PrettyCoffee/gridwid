import { Ref, RefCallback } from "react"

export const mergeRefs = <T>(
  ...refs: (Ref<T> | undefined | null)[]
): RefCallback<T> | undefined => {
  if (refs.every(ref => ref == null)) {
    return
  }

  return (value: T | null) => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value)
      } else if (ref != null) {
        ref.current = value
      }
    })
  }
}
