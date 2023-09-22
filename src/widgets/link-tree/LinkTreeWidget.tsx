import { useState } from "react"

import { HStack } from "~/components/base/Stack"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import { TreeNode, useLinkTreeData } from "./data"
import { LinkTree } from "./LinkTree"
import { LinkTreeEditor } from "./LinkTreeEditor"

const Content = ({ id, tree }: { id: string; tree: TreeNode[] }) => {
  const [filter, setFilter] = useState("")

  return (
    <>
      <HStack gap="1" className="py-1">
        <Input
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
          placeholder="Search"
        />
        <LinkTreeEditor id={id} />
      </HStack>
      <LinkTree tree={tree} filter={filter} />
    </>
  )
}

interface LinkTreeWidgetProps {
  id: string
  title?: string
}

export const LinkTreeWidget = ({ id, title }: LinkTreeWidgetProps) => {
  const data = useLinkTreeData(id)

  return (
    <Widget.Root>
      {title && <Widget.Header title={title} />}

      <Widget.Content
        className={cn("flex flex-col", !title && "pt-4")}
        scroll
        expand
      >
        <Content id={id} tree={data} />
      </Widget.Content>
    </Widget.Root>
  )
}
