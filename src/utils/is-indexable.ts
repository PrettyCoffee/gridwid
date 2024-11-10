export type Indexable = Record<string | number | symbol, unknown>

export const isIndexable = <T>(value: T): value is T & Indexable =>
  value != null && (typeof value === "object" || typeof value === "function")
