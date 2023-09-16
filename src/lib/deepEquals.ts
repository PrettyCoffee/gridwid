const keysMatch = (objA: object, objB: object) => {
  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)
  return (
    keysA.length === keysB.length && keysA.every(key => keysB.includes(key))
  )
}

export const deepEquals = (a: unknown, b: unknown): boolean => {
  if (a === b) return true

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return a === b
  }

  if (!keysMatch(a, b)) return false

  const hasMismatch = Object.keys(a).some(
    key =>
      // @ts-expect-error ts(7053)
      !deepEquals(a[key], b[key])
  )

  return !hasMismatch
}
