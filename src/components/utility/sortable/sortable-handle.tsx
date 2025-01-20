import { PropsWithChildren } from "react"

import { useSortable } from "@dnd-kit/sortable"
import { Slot } from "@radix-ui/react-slot"

import { AsChildProp } from "types/base-props"

import { Sortable } from "./types"
import { getId } from "./utils"

interface SortableHandleProps<T extends Sortable> extends AsChildProp {
  item: T
}

export const SortableHandle = <T extends Sortable>({
  asChild,
  item,
  children,
}: PropsWithChildren<SortableHandleProps<T>>) => {
  const { attributes, listeners } = useSortable({
    id: getId(item),
  })

  const Element = asChild ? Slot : "button"
  return (
    <Element {...attributes} {...listeners}>
      {children}
    </Element>
  )
}
