import { useSortable } from "@dnd-kit/react/sortable"

import { createContext } from "utils/create-context"

import { Sortable } from "./types"

type State = ReturnType<typeof useSortable<Sortable>>

const { Provider, useRequiredValue } = createContext<State>("SortableItem")
export const SortableItemProvider = Provider
export const useSortableItemContext = useRequiredValue
