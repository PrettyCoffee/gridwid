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

const getAllLinks = <
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
>(
  tree: (GroupType | ItemType)[]
): ItemType[] =>
  tree.flatMap(node => (isGroup(node) ? getAllLinks(node.items) : node))

const searchTree = <
  GroupType extends MenuGroup<GroupType, ItemType>,
  ItemType extends MenuItem
>(
  tree: (GroupType | ItemType)[],
  filter: string
) => {
  const links = getAllLinks(tree)
  return !filter ? null : links.filter(link => link.label.includes(filter))
}

const sortMenuItems = <
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
  nodes: (GroupType | ItemType)[],
  filter?: string
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

  const items = useMemo(() => {
    const items = filter
      ? searchTree<GroupType, ItemType>(nodes, filter) ?? []
      : group?.items ?? nodes

    return sortMenuItems<GroupType, ItemType>(items)
  }, [group?.items, nodes, filter])

  const reset = useCallback(() => setPath([]), [])
  const back = useCallback(() => setPath(path => path.slice(0, -1)), [])
  const navigate = useCallback(
    (id: string) => setPath(path => [...path, id]),
    []
  )

  return { group, path, items, reset, back, navigate }
}
