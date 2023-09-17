import { Dispatch, useState } from "react"

import { Bookmark, ChevronLeft, ChevronRight, Folder } from "lucide-react"

import { Icon } from "~/components/Icon"
import { ListItem } from "~/components/ListItem"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

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
    <Icon
      icon={ChevronRight}
      size="sm"
      color="muted"
      className="ml-auto [:not(:hover)>&]:hidden"
    />
  </ListItem.Root>
)

interface CurrentGroupProps {
  label: string
  onClick: () => void
}

const CurrentGroup = ({ label, onClick }: CurrentGroupProps) =>
  label === "root" ? (
    <ListItem.Root className="min-h-[theme(height.8)]">
      <ListItem.Caption
        title={label}
        size="sm"
        className="text-muted-foreground"
      />
    </ListItem.Root>
  ) : (
    <ListItem.Root onClick={onClick} className="min-h-[theme(height.8)]">
      <Icon icon={ChevronLeft} size="sm" color="muted" />
      <ListItem.Caption
        title={label}
        size="sm"
        className="text-muted-foreground"
      />
    </ListItem.Root>
  )

const LinkNode = (node: TreeNode & { navigate: Dispatch<string> }) =>
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
      <div className="flex gap-1 py-1">
        <Input
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
          placeholder="Search"
          className=""
        />
      </div>
      <CurrentGroup onClick={back} label={group?.label ?? "root"} />
      <div className="pl-0 flex-1 flex flex-col overflow-y-auto -mr-4 pr-4">
        {group?.items.map(node => (
          <LinkNode key={node.label} navigate={navigate} {...node} />
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
      <Widget.Content className={cn("flex flex-col", !title && "pt-4")} scroll>
        <LinkTree tree={demoData} />
      </Widget.Content>
    </Widget.Root>
  )
}
