import { createDataAtom } from "../createDataAtom"

export interface TreeLink {
  id: string
  label: string
  href: string
}

export interface TreeGroup {
  id: string
  label: string
  items: TreeNode[]
}

export type TreeNode = TreeLink | TreeGroup

const data = createDataAtom<TreeNode[]>("link-tree-widget", [])

const addToTree = (
  tree: TreeNode[],
  path: string[],
  item: TreeNode
): TreeNode[] => {
  const [key, ...restPath] = path
  if (!key) {
    return [...tree, item]
  }

  return tree.map(node =>
    node.id !== key || !("items" in node)
      ? node
      : { ...node, items: addToTree(node.items, restPath, item) }
  )
}

const addNode = (id: string, path: string[], item: TreeNode) => {
  data.setData(id, tree => addToTree(tree, path, item))
}

const editTreeNode = (
  tree: TreeNode[],
  path: string[],
  item: Partial<TreeNode>
): TreeNode[] => {
  const [key, ...restPath] = path
  if (restPath.length === 0) {
    return tree.map(existing =>
      existing.id !== key ? existing : { ...existing, ...item }
    )
  }
  return tree.map(node =>
    node.id !== key || !("items" in node)
      ? node
      : { ...node, items: editTreeNode(node.items, restPath, item) }
  )
}

const editNode = (id: string, path: string[], item: TreeNode) => {
  data.setData(id, tree => editTreeNode(tree, path, item))
}

const removeFromTree = (tree: TreeNode[], path: string[]): TreeNode[] => {
  console.log(path)
  const [key, ...restPath] = path
  if (!key) {
    return [...tree]
  }

  if (restPath.length === 0) {
    return tree.filter(({ id }) => id !== key)
  }

  return tree.map(node =>
    node.id !== key || !("items" in node)
      ? node
      : { ...node, items: removeFromTree(node.items, restPath) }
  )
}

const removeNode = (id: string, path: string[]) => {
  data.setData(id, tree => removeFromTree(tree, path))
}

export const useLinkTreeData = data.useData

export const linkTree = {
  atom: data.atom,
  setNodes: data.setData,
  addNode,
  editNode,
  removeNode,
}
