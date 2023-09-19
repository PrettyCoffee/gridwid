import { Dispatch, useEffect } from "react"

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

import { TreeLink, TreeGroup, TreeNode } from "./LinkTreeWidget"
import { isGroup, useCascadingMenu } from "./useCascadingMenu"

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

interface HeaderProps {
  label: string
  onClick: () => void
}

const StaticHeader = ({ label }: Pick<HeaderProps, "label">) => (
  <ListItem.Root className="min-h-[theme(height.8)]">
    <ListItem.Caption
      title={label}
      size="sm"
      className="text-muted-foreground"
    />
  </ListItem.Root>
)

const ClickableHeader = ({ label, onClick }: HeaderProps) => (
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
  isGroup<TreeGroup, TreeLink>(node) ? (
    <LinkGroup {...node} />
  ) : (
    <LinkItem {...node} />
  )

const NoLinks = () => <NoData icon={Unlink} message="No links found." />

interface LinkTreeProps {
  tree: TreeNode[]
  filter?: string
}

export const LinkTree = ({ tree, filter }: LinkTreeProps) => {
  const { group, items, back, navigate, reset } = useCascadingMenu<
    TreeGroup,
    TreeLink
  >(tree, filter)

  useEffect(() => {
    // Reset the menu when filtering
    if (filter && group) reset()
  }, [filter, group, reset])

  const header = filter ? (
    <StaticHeader label="Search results" />
  ) : !group ? (
    <StaticHeader label="root" />
  ) : (
    <ClickableHeader label={group.label} onClick={back} />
  )

  return (
    <>
      {items.length === 0 ? (
        <NoLinks />
      ) : (
        <div className="pl-0 flex-1 flex flex-col overflow-y-auto -mr-4 pr-4">
          {header}
          {items.map(node => (
            <LinkNode key={node.id} navigate={navigate} {...node} />
          ))}
        </div>
      )}
    </>
  )
}
