import { Dispatch, useState } from "react"

import { ArrowLeft, Bookmark, Folder } from "lucide-react"

import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { Text } from "~/components/Text"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"

import { demoData } from "./demoData"

interface TreeLink {
  label: string
  href: string
}

interface TreeGroup {
  label: string
  items: TreeNode[]
}

export type TreeNode = TreeLink | TreeGroup

const LinkItem = ({ label, href }: TreeLink) => (
  <ListItem.Root href={href} className="min-h-[theme(height.8)]">
    <Icon icon={Bookmark} size="sm" />
    <ListItem.Caption title={label} size="sm" />
  </ListItem.Root>
)

const LinkGroup = ({
  label,
  navigate,
}: TreeGroup & { navigate: Dispatch<string> }) => (
  <ListItem.Root
    onClick={() => navigate(label)}
    className="min-h-[theme(height.8)]"
  >
    <Icon icon={Folder} size="sm" color="highlight" />
    <ListItem.Caption title={label} size="sm" />
  </ListItem.Root>
)

const Node = (node: TreeNode & { navigate: Dispatch<string> }) =>
  "items" in node ? <LinkGroup {...node} /> : <LinkItem {...node} />

const getAllLinks = (tree: TreeNode[]): TreeLink[] =>
  tree.flatMap(node => {
    if ("items" in node) return getAllLinks(node.items)
    return node
  })

const searchTree = (tree: TreeNode[], filter: string): TreeGroup => {
  const links = getAllLinks(tree)
  return {
    label: "Search results",
    items: links.filter(link => link.label.includes(filter)),
  }
}

const LinkTree = ({ tree }: { tree: TreeNode[] }) => {
  const [path, setPath] = useState<TreeGroup[]>([
    { label: "root", items: tree },
  ])
  const [filter, setFilter] = useState("")
  const parent = path[path.length - 2]

  const group = !filter ? path[path.length - 1] : searchTree(tree, filter)

  const navigate = (label: string) => {
    setPath(path => {
      const current = path[path.length - 1]
      const target = current?.items.find(item => item.label === label)
      if (!target || !("items" in target)) return path
      return [...path, target]
    })
  }
  const back = () => {
    setPath(path => path.slice(0, -1))
  }

  return (
    <>
      <div className="pl-2 h-8 flex justify-between items-center">
        <Text color="muted" size="sm">
          {group?.label === "root" ? "~" : group?.label}
        </Text>
        {parent && (
          <IconButton
            title={`Back to ${parent.label}`}
            icon={ArrowLeft}
            onClick={back}
            titleSide="left"
            compact
          />
        )}
      </div>
      <div className="flex gap-1 py-1">
        <Input
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
          placeholder="Search"
          className=""
        />
      </div>
      <div className="flex-1 flex flex-col overflow-y-auto -mr-4 pr-4">
        {group?.items.map(node => (
          <Node key={node.label} navigate={navigate} {...node} />
        ))}
      </div>
    </>
  )
}

interface LinkTreeWidgetProps {
  id: string
  title?: string
}

export const LinkTreeWidget = ({ title }: LinkTreeWidgetProps) => {
  return (
    <Widget.Root>
      {title && <Widget.Header title={title} />}
      <Widget.Content className="flex flex-col" scroll>
        <LinkTree tree={demoData} />
      </Widget.Content>
    </Widget.Root>
  )
}
