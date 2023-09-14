export type SortOrder = "asc" | "desc"

enum AscPrio {
  more = 1,
  neutral = 0,
  less = -1,
}
enum DescPrio {
  more = -1,
  neutral = 0,
  less = 1,
}
const priorityByOrder = {
  asc: AscPrio,
  desc: DescPrio,
}

type SortFn<T> = (order: SortOrder) => (a: T, b: T) => 1 | 0 | -1

export const booleanSort: SortFn<boolean> = order => {
  const { more, neutral, less } = priorityByOrder[order]
  return (a, b) => (a && !b ? more : b && !a ? less : neutral)
}

export const numberSort: SortFn<number> = order => {
  const { more, neutral, less } = priorityByOrder[order]
  return (a, b) => (a === b ? neutral : a > b ? more : less)
}

export const stringSort: SortFn<string> = order => {
  const { more, neutral, less } = priorityByOrder[order]
  return (a, b) => (a === b ? neutral : a > b ? more : less)
}
