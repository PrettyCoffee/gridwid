import { Dispatch, useState } from "react"

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Folder,
  Unlink,
} from "lucide-react"

import { Icon } from "~/components/Icon"
import { ListItem } from "~/components/ListItem"
import { NoData } from "~/components/NoData"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import { demoData } from "./demoData"
import { useCascadingMenu } from "./useCascadingMenu"

interface TreeLink {
  id: string
  label: string
  href: string
}

interface TreeGroup {
  id: string
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
  id,
  label,
  navigate,
}: TreeGroup & { navigate: Dispatch<string> }) => (
  <ListItem.Root
    onClick={() => navigate(id)}
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
  onClick?: () => void
}

const CurrentGroup = ({ label, onClick }: CurrentGroupProps) =>
  !onClick ? (
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

const searchTree = (tree: TreeNode[], filter: string) => {
  const links = getAllLinks(tree)
  if (!filter) return null
  return links.filter(link => link.label.includes(filter))
}

const NoLinks = () => <NoData icon={Unlink} message="No links found." />

const LinkTree = ({ tree }: { tree: TreeNode[] }) => {
  const { group, items, back, navigate, reset } = useCascadingMenu<
    TreeGroup,
    TreeLink
  >(tree)
  const [filter, setFilter] = useState("")

  const filteredItems = searchTree(tree, filter)
  const handleFilter = (filter: string) => {
    setFilter(filter)
    if (group) reset()
  }

  const groupLabel = filteredItems ? "Search results" : group?.label ?? "root"
  const groupClick = !group ? undefined : back

  return (
    <>
      <div className="flex gap-1 py-1">
        <Input
          value={filter}
          onChange={({ target }) => handleFilter(target.value)}
          placeholder="Search"
        />
      </div>
      {filteredItems?.length === 0 || items.length === 0 ? (
        <NoLinks />
      ) : (
        <>
          <CurrentGroup label={groupLabel} onClick={groupClick} />
          {(filteredItems ?? items).map(node => (
            <LinkNode key={node.id} navigate={navigate} {...node} />
          ))}
        </>
      )}
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
      <Widget.Content
        className={cn("flex flex-col", !title && "pt-4")}
        scroll
        expand
      >
        <LinkTree tree={demoData} />
      </Widget.Content>
    </Widget.Root>
  )
}
