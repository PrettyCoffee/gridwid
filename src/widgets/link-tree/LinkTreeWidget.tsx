import { useState } from "react"

import { MoreVertical, PenLine } from "lucide-react"

import { HStack } from "~/components/base/Stack"
import { MenuButton } from "~/components/MenuButton"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import { useLinkTreeData } from "./data"
import { LinkTree } from "./LinkTree"
import { LinkTreeEditor } from "./LinkTreeEditor"

interface MenuProps {
  onEdit: () => void
}
const Menu = ({ onEdit }: MenuProps) => {
  return (
    <MenuButton
      icon={MoreVertical}
      title="Link tree widget settings"
      hideTitle
      items={[
        {
          label: "Open editor",
          icon: PenLine,
          onClick: () => onEdit(),
        },
      ]}
    />
  )
}

interface LinkTreeWidgetProps {
  id: string
  title?: string
}

export const LinkTreeWidget = ({ id, title }: LinkTreeWidgetProps) => {
  const data = useLinkTreeData(id)
  const [filter, setFilter] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const menuButton = <Menu onEdit={() => setIsEditing(true)} />

  return (
    <>
      <LinkTreeEditor id={id} open={isEditing} onOpenChange={setIsEditing} />

      <Widget.Root>
        {title && <Widget.Header title={title}>{menuButton}</Widget.Header>}

        <Widget.Content
          className={cn("flex flex-col", !title ? "pt-4" : "pt-2")}
          scroll
          expand
        >
          <HStack gap="1">
            <Input
              value={filter}
              onChange={({ target }) => setFilter(target.value)}
              placeholder="Search"
            />
            {!title && menuButton}
          </HStack>
          <LinkTree tree={data} filter={filter} />
        </Widget.Content>
      </Widget.Root>
    </>
  )
}
