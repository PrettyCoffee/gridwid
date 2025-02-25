import { PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"

import { AsChildProp } from "types/base-props"

import { useSortableItemContext } from "./sortable-item-context"

export const SortableItemHandle = ({
  asChild,
  children,
}: PropsWithChildren<AsChildProp>) => {
  const sortable = useSortableItemContext()
  const Element = asChild ? Slot : "button"
  return <Element ref={sortable.handleRef}>{children}</Element>
}
