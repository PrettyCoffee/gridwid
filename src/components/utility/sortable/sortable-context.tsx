import { Dispatch, PropsWithChildren, ReactNode, useState } from "react"

import type { DragOperation } from "@dnd-kit/abstract"
import type { Draggable } from "@dnd-kit/dom"
import { arrayMove } from "@dnd-kit/helpers"
import { DragDropProvider, DragOverlay } from "@dnd-kit/react"
import { isSortable } from "@dnd-kit/react/sortable"
import { css } from "goober"

import { Sortable } from "./types"
import { getItem } from "./utils"

const forceGrabbingPointer = css`
  * {
    cursor: grabbing !important;
  }
`

const addPointer = () => document.body.classList.add(forceGrabbingPointer)
const removePointer = () => document.body.classList.remove(forceGrabbingPointer)

const getOperationIndex = (source: Draggable | null) => {
  if (!isSortable(source)) return { prev: null, next: null }

  const initial = Number(source.sortable.initialIndex)
  const current = Number(source.sortable.index)
  return {
    prev: Number.isNaN(initial) ? null : initial,
    next: Number.isNaN(current) ? null : current,
  }
}

export interface SortableContextProps<T extends Sortable> {
  items: T[]
  onSort: Dispatch<(items: T[]) => T[]>
  OverlayItem: (props: { source: Draggable<T> }) => ReactNode
}

export const SortableContext = <T extends Sortable>({
  items,
  onSort,
  OverlayItem,
  children,
}: PropsWithChildren<SortableContextProps<T>>) => {
  const [active, setActive] = useState<T | null>(null)

  if (active) addPointer()
  else removePointer()

  const handleDragStart = (operation: DragOperation) => {
    setActive(getItem(items, String(operation.source?.id)))
  }

  const handleDragEnd = (operation: DragOperation) => {
    setActive(null)
    const { prev, next } = getOperationIndex(operation.source as Draggable)
    if (prev == null || next == null) return
    onSort(items => arrayMove(items, prev, next))
  }

  return (
    <DragDropProvider
      onDragStart={({ operation }) => handleDragStart(operation)}
      onDragEnd={({ operation }) => handleDragEnd(operation)}
    >
      {children}

      <DragOverlay>{source => <OverlayItem source={source} />}</DragOverlay>
    </DragDropProvider>
  )
}
