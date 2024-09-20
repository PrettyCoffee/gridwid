import { Ref, RefCallback, useMemo } from "react"

const mergeRefs = <T>(
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
        // @ts-expect-error readonly ref must be reassigned here
        ref.current = value
      }
    })
  }
}

export const useMergeRefs = <T>(refs: (Ref<T> | undefined | null)[]) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(() => mergeRefs(...refs), refs)
