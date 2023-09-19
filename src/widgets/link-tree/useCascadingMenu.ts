import { useCallback, useMemo, useState } from "react"

export interface MenuItem {
  id: string
  label: string
}
export interface MenuGroup<
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
> {
  id: string
  label: string
  items: (GroupType | ItemType)[]
}

export const isGroup = <
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
>(
  node: GroupType | ItemType
): node is GroupType => "items" in node

const sortGroupsFirst = <
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
>(
  tree: (GroupType | ItemType)[]
): (GroupType | ItemType)[] =>
  [...tree].sort((a, b) => {
    if (isGroup(a) && !isGroup(b)) return -1
    if (isGroup(b) && !isGroup(a)) return 1
    return a.label.localeCompare(b.label)
  })

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
        if (!node || !isGroup(node)) return current
        return node
      }, null),
    [path, nodes]
  )

  const items = useMemo(
    () =>
      !group?.items
        ? sortGroupsFirst<GroupType, ItemType>(nodes)
        : sortGroupsFirst<GroupType, ItemType>(group.items),
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
