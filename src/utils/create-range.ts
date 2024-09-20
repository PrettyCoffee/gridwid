export const createRange = (start: number, end: number, step = 1) => {
  const getValue = (index: number) => (index + start) * step
  const length = Math.abs(Math.floor(end - start))
  return Array.from({ length }, (_, index) => getValue(index))
}
