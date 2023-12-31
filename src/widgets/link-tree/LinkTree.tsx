import { Dispatch, useEffect } from "react"

import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Folder,
  Unlink,
} from "lucide-react"

import { VStack } from "~/components/base/Stack"
import { Icon } from "~/components/Icon"
import { ListItem } from "~/components/ListItem"
import { NoData } from "~/components/NoData"

import { TreeLink, TreeGroup, TreeNode } from "./data"
import { isGroup, useCascadingMenu } from "./useCascadingMenu"

const LinkItem = ({ label, href }: TreeLink) => (
  <ListItem.Root compact>
    <ListItem.Clickable href={href} className="flex-1">
      <Icon icon={Bookmark} size="sm" />
      <ListItem.Caption title={label} />
    </ListItem.Clickable>
  </ListItem.Root>
)

const LinkGroup = ({
  id,
  label,
  navigate,
}: TreeGroup & { navigate: Dispatch<string> }) => (
  <ListItem.Root compact>
    <ListItem.Clickable onClick={() => navigate(id)}>
      <Icon icon={Folder} size="sm" color="accent" />
      <ListItem.Caption title={label} />
      <Icon
        icon={ChevronRight}
        size="sm"
        color="muted"
        className="ml-auto [:not(:hover)>&]:hidden"
      />
    </ListItem.Clickable>
  </ListItem.Root>
)

interface HeaderProps {
  label: string
  onClick: () => void
}

const StaticHeader = ({ label }: Pick<HeaderProps, "label">) => (
  <ListItem.Root compact className="px-2 py-2 min-h-[theme(height.8)]">
    <ListItem.Caption title={label} className="text-muted-foreground" />
  </ListItem.Root>
)

const ClickableHeader = ({ label, onClick }: HeaderProps) => (
  <ListItem.Root compact className="min-h-[theme(height.8)]">
    <ListItem.Clickable onClick={onClick}>
      <Icon icon={ChevronLeft} size="sm" color="muted" />
      <ListItem.Caption title={label} className="text-muted-foreground" />
    </ListItem.Clickable>
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
    <VStack className="flex-1 pl-0 overflow-y-auto -mr-4 pr-4">
      {header}
      {items.length === 0 ? (
        <NoLinks />
      ) : (
        items.map(node => (
          <LinkNode key={node.id} navigate={navigate} {...node} />
        ))
      )}
    </VStack>
  )
}
