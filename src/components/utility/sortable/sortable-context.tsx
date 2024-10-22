import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext as SortableDndContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { css } from "goober"
import { Dispatch, PropsWithChildren, useState } from "react"

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
  OverlayItem: (props: { item: T }) => JSX.Element
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    setActive(getItem(items, active.id as string))
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over === null || active.id === over.id) return

    onSort(items => {
      const oldIndex = items.findIndex(item => getId(item) === active.id)
      const newIndex = items.findIndex(item => getId(item) === over.id)
      return arrayMove(items, oldIndex, newIndex)
    })

    setActive(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableDndContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableDndContext>

      <DragOverlay>{active ? <OverlayItem item={active} /> : null}</DragOverlay>
    </DndContext>
  )
}
