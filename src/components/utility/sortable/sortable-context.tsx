import { Dispatch, PropsWithChildren, ReactNode, useState } from "react"

import { Draggable, DragOperation } from "@dnd-kit/abstract"
import { arrayMove } from "@dnd-kit/helpers"
import { DragDropProvider, DragOverlay } from "@dnd-kit/react"
import { css } from "goober"

import { Sortable } from "./types"
import { getId, getItem } from "./utils"

const forceGrabbingPointer = css`
  * {
    cursor: grabbing !important;
  }
`

const addPointer = () => document.body.classList.add(forceGrabbingPointer)
const removePointer = () => document.body.classList.remove(forceGrabbingPointer)

interface SortableContextProps<T extends Sortable> {
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

  const handleDragEnd = ({ source, target }: DragOperation) => {
    setActive(null)
    if (!target || !source || source?.id === target.id) return

    onSort(items => {
      const oldIndex = items.findIndex(item => getId(item) === source.id)
      const newIndex = items.findIndex(item => getId(item) === target.id)
      return arrayMove(items, oldIndex, newIndex)
    })
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
