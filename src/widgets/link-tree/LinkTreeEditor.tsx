import { Dispatch, useEffect, useId, useState } from "react"

import {
  Bookmark,
  BookmarkPlus,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderPlus,
  PenLine,
  Trash,
} from "lucide-react"

import { HStack, VStack } from "~/components/base/Stack"
import { Icon } from "~/components/Icon"
import { InputLabel } from "~/components/InputLabel"
import { ListItem } from "~/components/ListItem"
import { Button } from "~/components/ui/button"
import { DialogProps, Dialog } from "~/components/ui/dialog"
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

const createId = () => {
  const bytes = new Uint8Array(4)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
}

const createTask = () => ({
  id: createId(),
  label: "New task",
  href: "https://example.com",
})

const createGroup = () => ({
  id: createId(),
  label: "New group",
  items: [],
})

interface HeaderProps {
  label: string
  onClick: () => void
}

const StaticHeader = ({ label }: Pick<HeaderProps, "label">) => (
  <ListItem.Caption
    title={label}
    className="pl-2.5 flex-1 text-muted-foreground"
  />
)

const ClickableHeader = ({ label, onClick }: HeaderProps) => (
  <ListItem.Clickable onClick={onClick}>
    <Icon icon={ChevronLeft} color="muted" />
    <ListItem.Caption title={label} className="text-muted-foreground" />
  </ListItem.Clickable>
)

interface ItemEditorProps {
  item: TreeGroup | TreeLink
  onSave: Dispatch<TreeNode>
  onCancel: () => void
}

const ItemEditor = ({ item, onSave, onCancel }: ItemEditorProps) => {
  const [localItem, setLocalItem] = useState(item)
  const label = localItem.label
  const href = isGroup(localItem) ? null : localItem.href
  const id = useId()

  return (
    <>
      <VStack gap="2" className="py-2">
        <InputLabel
          htmlFor={`label-${id}`}
          label={isGroup(localItem) ? "Group label" : "Bookmark label"}
        >
          <Input
            id={`label-${id}`}
            placeholder={
              isGroup(localItem) ? "e.g. reddit" : " e.g. r/startpages (rip)"
            }
            value={label}
            onChange={({ target }) =>
              setLocalItem(item => ({ ...item, label: target.value }))
            }
          />
        </InputLabel>
        {href != null && (
          <InputLabel htmlFor={`link-${id}`} label="Bookmark link">
            <Input
              id={`link-${id}`}
              placeholder="e.g. https://www.reddit.com/r/startpages/"
              value={href}
              onChange={({ target }) =>
                setLocalItem(item => ({ ...item, href: target.value }))
              }
            />
          </InputLabel>
        )}
      </VStack>
      <HStack gap="2" className="justify-end">
        <Button
          variant="outline"
          onClick={() => {
            setLocalItem(item)
            onCancel()
          }}
        >
          Cancel
        </Button>
        <Button variant="default" onClick={() => onSave(localItem)}>
          Save
        </Button>
      </HStack>
    </>
  )
}

interface LinkEditorProps {
  item: TreeGroup | TreeLink
  navigate: Dispatch<string>
  onDelete: () => void
  onEdit: () => void
}

const LinkEditor = ({ item, navigate, onDelete, onEdit }: LinkEditorProps) => {
  const mainItem = isGroup(item) ? (
    <ListItem.Clickable
      key={item.id}
      onClick={() => navigate(item.id)}
      className="flex-1 overflow-hidden"
    >
      <Icon
        icon={isGroup(item) ? Folder : Bookmark}
        color={isGroup(item) ? "accent" : "muted"}
        size="sm"
      />
      <ListItem.Caption title={item.label} className="flex-1" />
      <Icon
        icon={ChevronRight}
        color="muted"
        size="md"
        className="[:not(:hover)>&]:opacity-0"
      />
    </ListItem.Clickable>
  ) : (
    <div className="flex-1 flex px-2 gap-2 items-center overflow-hidden">
      <Icon icon={Bookmark} color="muted" size="sm" />
      <ListItem.Caption title={item.label} />
    </div>
  )

  return (
    <ListItem.Root
      key={item.id}
      rowHover
      className="p-1 flex max-w-full rounded-md"
    >
      {mainItem}

      <ListItem.Action
        icon={PenLine}
        title={`Edit`}
        onClick={onEdit}
        hideTitle
      />
      <ListItem.Action
        icon={Trash}
        title={`Delete`}
        onClick={onDelete}
        hideTitle
        className="[&>svg]:text-error"
      />
    </ListItem.Root>
  )
}

interface TreeEditorProps {
  id: string
  data: TreeNode[]
}
const TreeEditor = ({ id, data }: TreeEditorProps) => {
  const { group, path, items, back, navigate } = useCascadingMenu<
    TreeGroup,
    TreeLink
  >(data)

  const [editItem, setEditItem] = useState<TreeNode | null>(null)

  const header = (
    <ListItem.Root rowHover className="w-full p-1">
      {!group ? (
        <StaticHeader label="root" />
      ) : (
        <ClickableHeader label={group.label} onClick={back} />
      )}
      <ListItem.Action
        icon={FolderPlus}
        title="Add group"
        onClick={() => linkTree.addNode(id, path, createGroup())}
      />
      <ListItem.Action
        icon={BookmarkPlus}
        title="Add bookmark"
        onClick={() => linkTree.addNode(id, path, createTask())}
      />
    </ListItem.Root>
  )

  if (editItem) {
    return (
      <>
        {header}
        <div className="pl-4">
          <ItemEditor
            item={editItem}
            onSave={node => {
              linkTree.editNode(id, [...path, node.id], node)
              setEditItem(null)
            }}
            onCancel={() => setEditItem(null)}
          />
        </div>
      </>
    )
  }

  return (
    <>
      {header}

      <VStack className="overflow-y-auto -mx-6 px-6">
        {items.map(item => (
          <LinkEditor
            key={item.id}
            item={item}
            navigate={navigate}
            onDelete={() => linkTree.removeNode(id, [...path, item.id])}
            onEdit={() => setEditItem(item)}
          />
        ))}
      </VStack>
    </>
  )
}

const useSetDemoData = (id: string, apply = false) => {
  useEffect(() => {
    if (!apply) return
    linkTree.setNodes(id, demoData)
  }, [apply, id])
}

interface LinkTreeEditorProps
  extends Pick<DialogProps, "open" | "onOpenChange"> {
  id: string
}

export const LinkTreeEditor = ({ id, ...dialogProps }: LinkTreeEditorProps) => {
  const data = useLinkTreeData(id)
  useSetDemoData(id)

  return (
    <Dialog
      {...dialogProps}
      title="Link editor"
      description="Hover on bookmarks or groups to see their actions."
      size="md"
      className="flex flex-col h-[calc(theme(height.60)*2)]"
    >
      <div className="pb-2" />
      <TreeEditor id={id} data={data} />
    </Dialog>
  )
}
