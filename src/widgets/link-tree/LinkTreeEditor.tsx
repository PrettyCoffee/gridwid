import { Dispatch, useEffect, useState } from "react"

import {
  Bookmark,
  BookmarkPlus,
  ChevronLeft,
  Folder,
  FolderOpen,
  FolderPlus,
  GripHorizontal,
  Save,
  Settings,
  Trash,
  X,
} from "lucide-react"

import { Stack } from "~/components/base/Stack"
import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"

import {
  TreeGroup,
  TreeLink,
  TreeNode,
  linkTree,
  useLinkTreeData,
} from "./data"
import { demoData } from "./demoData"
import { isGroup, useCascadingMenu } from "./useCascadingMenu"

const createId = () => Math.random().toString(36).slice(2, 10).toUpperCase()

interface HeaderProps {
  label: string
  onClick: () => void
}

const StaticHeader = ({ label }: Pick<HeaderProps, "label">) => (
  <ListItem.Caption
    title={label}
    size="md"
    className="pl-2.5 flex-1 text-muted-foreground"
  />
)

const ClickableHeader = ({ label, onClick }: HeaderProps) => (
  <ListItem.Clickable onClick={onClick}>
    <Icon icon={ChevronLeft} size="md" color="muted" />
    <ListItem.Caption
      title={label}
      size="md"
      className="text-muted-foreground"
    />
  </ListItem.Clickable>
)

interface ItemProps {
  item: TreeGroup | TreeLink
  navigate: Dispatch<string>
  isEditing?: boolean
  onStartEditing: Dispatch<string>
  onSave: Dispatch<TreeNode>
  onDelete: () => void
  onEndEditing: () => void
}

const LinkEditor = ({
  item,
  navigate,
  isEditing,
  onStartEditing,
  onSave,
  onEndEditing,
  onDelete,
}: ItemProps) => {
  const [label, setLabel] = useState(item.label)
  const [href, setHref] = useState(isGroup(item) ? "" : item.href)

  useEffect(() => {
    if (isEditing && item.label !== label) return
    setLabel(item.label)
  }, [label, isEditing, item])

  const mainItem = isEditing ? (
    <Stack gap="1" className="w-full">
      <Input
        value={label}
        onChange={({ target }) => setLabel(target.value)}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
      />
      {!isGroup(item) && (
        <Input value={href} onChange={({ target }) => setHref(target.value)} />
      )}
    </Stack>
  ) : (
    <ListItem.Clickable
      key={item.id}
      onClick={() => onStartEditing(item.id)}
      className="flex-1 overflow-hidden"
    >
      <Icon
        icon={isGroup(item) ? Folder : Bookmark}
        color={isGroup(item) ? "highlight" : "muted"}
        size="sm"
        strokeWidth={5}
      />
      <ListItem.Caption title={item.label} />
    </ListItem.Clickable>
  )

  const actions = isEditing ? (
    <>
      <ListItem.Action
        icon={Save}
        title={`Save changes`}
        onClick={() => {
          onSave({ ...item, label, href })
          onEndEditing()
        }}
      />
      <ListItem.Action
        icon={X}
        title={`Stop editing`}
        onClick={() => {
          setLabel(item.label)
          setHref(isGroup(item) ? "" : item.href)
          onEndEditing()
        }}
      />
    </>
  ) : (
    <>
      {isGroup(item) && (
        <ListItem.Action
          icon={FolderOpen}
          title={`Open`}
          onClick={() => navigate(item.id)}
        />
      )}
      <ListItem.Action icon={Trash} title={`Delete`} onClick={onDelete} />
    </>
  )

  return (
    <ListItem.Root
      key={item.id}
      className="p-1 flex max-w-full rounded-md hover:bg-accent/50"
    >
      <IconButton icon={GripHorizontal} title={`Open`} hideTitle />
      {mainItem}
      {actions}
    </ListItem.Root>
  )
}

interface TreeEditorProps {
  id: string
  data: TreeNode[]
}
const TreeEditor = ({ id, data }: TreeEditorProps) => {
  const [editing, setEditing] = useState<string | null>(null)
  const { group, path, items, back, navigate } = useCascadingMenu<
    TreeGroup,
    TreeLink
  >(data)

  return (
    <>
      <Stack direction="horizontal">
        <ListItem.Root className="w-full p-1">
          {!group ? (
            <StaticHeader label="root" />
          ) : (
            <ClickableHeader label={group.label} onClick={back} />
          )}
          <IconButton
            icon={FolderPlus}
            title="Add group"
            onClick={() =>
              linkTree.addNode(id, path, {
                id: createId(),
                label: "New group",
                items: [],
              })
            }
          />
          <IconButton
            icon={BookmarkPlus}
            title="Add bookmark"
            onClick={() =>
              linkTree.addNode(id, path, {
                id: createId(),
                label: "New bookmark",
                href: "https://example.com",
              })
            }
          />
        </ListItem.Root>
      </Stack>

      <Stack className="overflow-y-auto">
        {items.map(item => (
          <LinkEditor
            key={item.id}
            item={item}
            navigate={navigate}
            isEditing={editing === item.id}
            onDelete={() => linkTree.removeNode(id, [...path, item.id])}
            onSave={node => linkTree.editNode(id, [...path, node.id], node)}
            onStartEditing={setEditing}
            onEndEditing={() => setEditing(null)}
          />
        ))}
      </Stack>
    </>
  )
}

const useSetDemoData = (id: string, apply = false) => {
  useEffect(() => {
    if (!apply) return
    linkTree.setNodes(id, demoData)
  }, [apply, id])
}

interface LinkTreeEditorProps {
  id: string
}

export const LinkTreeEditor = ({ id }: LinkTreeEditorProps) => {
  const data = useLinkTreeData(id)
  useSetDemoData(id)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconButton icon={Settings} title="Editor" />
      </DialogTrigger>
      <DialogContent
        size="md"
        className="flex flex-col h-[calc(theme(height.60)*2)]"
      >
        <DialogHeader>
          <DialogTitle>Link tree editor</DialogTitle>
          <DialogDescription>
            Hover on bookmarks or groups for more actions and click on their
            name to edit them.
          </DialogDescription>
        </DialogHeader>
        <div className="pb-2" />
        <TreeEditor id={id} data={data} />
      </DialogContent>
    </Dialog>
  )
}
