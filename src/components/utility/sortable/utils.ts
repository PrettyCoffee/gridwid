import { Sortable } from "./types"

export const getId = (item: Sortable) =>
  typeof item === "object" ? item.id : item

export const getItem = <T extends Sortable>(items: T[], id: string) =>
  items.find(item => getId(item) === id) ?? null
