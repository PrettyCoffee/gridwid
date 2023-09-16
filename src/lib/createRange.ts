type Range =
  | {
      start: number
      end: number
    }
  | number

export const createRange = (range: Range) => {
  const { start, end } =
    typeof range !== "number" ? range : { start: 0, end: range - 1 }

  const length = end - start + 1
  return Array.from({ length }, (_, index) => index + start)
}
