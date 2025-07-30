import { ReactNode } from "react"

import { shapeIntersection } from "@dnd-kit/collision"
import { useSortable } from "@dnd-kit/react/sortable"
import { Slot } from "@radix-ui/react-slot"

import { AsChildProp } from "types/base-props"

import { SortableItemProvider } from "./sortable-item-context"
import { Sortable } from "./types"
import { getId } from "./utils"

export interface SortableItemProps<T extends Sortable> extends AsChildProp {
  item: T
  draggable?: boolean
  children: (props: { isDragging: boolean; isDropping: boolean }) => ReactNode
  index: number
}

export const SortableItem = <T extends Sortable>({
  asChild,
  item,
  index,
  draggable,
  children,
}: SortableItemProps<T>) => {
  const sortable = useSortable({
    id: getId(item),
    index,
    disabled: draggable,
    data: item,
    collisionDetector: shapeIntersection,
  })

  const Element = asChild ? Slot : "div"
  return (
    <SortableItemProvider value={sortable}>
      <Element ref={sortable.ref}>
        {children({
          isDragging: sortable.isDragging,
          isDropping: sortable.isDropping,
        })}
      </Element>
    </SortableItemProvider>
  )
}
