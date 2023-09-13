type Order = "asc" | "desc"
const typeImportance = [
  "function",
  "object",
  "string",
  "bigint",
  "number",
  "boolean",
  "undefined",
  "symbol",
]
const getImportance = (value: unknown) => typeImportance.indexOf(typeof value)

type Sorts = "type" | "boolean" | "number" | "string" | "nullish" | "keepOrder"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sortBy: Record<Sorts, Record<Order, (a: any, b: any) => 1 | -1>> = {
  type: {
    asc: (a: unknown, b: unknown) =>
      sortBy.number.asc(getImportance(a), getImportance(b)),
    desc: (a: unknown, b: unknown) =>
      sortBy.number.desc(getImportance(a), getImportance(b)),
  },
  boolean: {
    asc: (a: boolean, b: boolean) => (!b ? -1 : 1),
    desc: (a: boolean) => (!a ? -1 : 1),
  },
  number: {
    asc: (a: number, b: number) => (a >= b ? 1 : -1),
    desc: (a: number, b: number) => (b >= a ? 1 : -1),
  },
  string: {
    asc: (a: string, b: string) =>
      a.toLowerCase() >= b.toLowerCase() ? 1 : -1,
    desc: (a: string, b: string) =>
      b.toLowerCase() >= a.toLowerCase() ? 1 : -1,
  },
  nullish: {
    asc: (a?: unknown, b?: unknown) => (b == null ? -1 : 1),
    desc: (a?: unknown) => (a == null ? -1 : 1),
  },
  keepOrder: {
    asc: () => 1,
    desc: () => -1,
  },
}

const typeEquals = (a: unknown, b: unknown) => typeof a === typeof b

const getSortType = (a: unknown, b: unknown): Sorts => {
  if (a == null || b == null) {
    return "nullish"
  }

  if (!typeEquals(a, b)) {
    return "type"
  }

  const type = typeof a
  if (type in sortBy) {
    return type as keyof typeof sortBy
  }

  return "keepOrder"
}

export const createSort = (type: keyof typeof sortBy, order: Order = "asc") =>
  sortBy[type][order]

export const createObjectSort = <T>(
  key: keyof T,
  type: keyof typeof sortBy,
  order: Order
) => {
  const sortFn = createSort(type, order)
  return (a: T, b: T) => sortFn(a[key], b[key])
}

export const autoSort = <T extends object>(
  values: T[],
  key: keyof T,
  order: Order
) =>
  values.sort((valA, valB) => {
    const a = valA[key]
    const b = valB[key]
    const sortFn = createSort(getSortType(a, b), order)
    return sortFn(a, b)
  })
