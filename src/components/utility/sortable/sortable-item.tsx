import { ReactNode } from "react"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Slot } from "@radix-ui/react-slot"

import { AsChildProp } from "types/base-props"

import { Sortable } from "./types"
import { getId } from "./utils"

interface SortableItemProps<T extends Sortable> extends AsChildProp {
  item: T
  draggable?: boolean
  children: (props: { isDragging: boolean }) => ReactNode
}

export const SortableItem = <T extends Sortable>({
  asChild,
  item,
  draggable,
  children,
}: SortableItemProps<T>) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: getId(item) })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const draggableProps = draggable ? { ...attributes, ...listeners } : {}

  const Element = asChild ? Slot : "div"
  return (
    <Element ref={setNodeRef} style={style} {...draggableProps}>
      {children({ isDragging })}
    </Element>
  )
}
