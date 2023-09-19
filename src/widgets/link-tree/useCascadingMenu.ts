import { useCallback, useMemo, useState } from "react"

interface MenuItem {
  id: string
}
interface MenuGroup<
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
> {
  id: string
  items: (GroupType | ItemType)[]
}

const sortGroupsFirst = <
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
>(
  tree: (GroupType | ItemType)[]
) => {
  const groups = tree.filter(node => "items" in node) as GroupType[]
  const items = tree.filter(node => !("items" in node)) as ItemType[]

  return [...groups, ...items]
}

export const useCascadingMenu = <
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
>(
  nodes: (GroupType | ItemType)[]
) => {
  const [path, setPath] = useState<string[]>([])

  const group = useMemo(
    () =>
      path.reduce<GroupType | null>((current, id) => {
        const items = current ? current.items : nodes
        const node = items.find(node => node.id === id)
        if (!node || !("items" in node)) return current
        return node
      }, null),
    [path, nodes]
  )

  const items = useMemo(
    () =>
      !group?.items
        ? nodes
        : (sortGroupsFirst(group.items) as (GroupType | ItemType)[]),
    [group?.items, nodes]
  )

  const reset = useCallback(() => setPath([]), [])
  const back = useCallback(() => setPath(path => path.slice(0, -1)), [])
  const navigate = useCallback(
    (id: string) => setPath(path => [...path, id]),
    []
  )

  return { group, items, reset, back, navigate }
}
