import { useState } from "react"

import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import { demoData } from "./demoData"
import { LinkTree } from "./LinkTree"

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

const Content = ({ tree }: { tree: TreeNode[] }) => {
  const [filter, setFilter] = useState("")

  return (
    <>
      <div className="flex gap-1 py-1">
        <Input
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
          placeholder="Search"
        />
      </div>
      <LinkTree tree={tree} filter={filter} />
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
        <Content tree={demoData} />
      </Widget.Content>
    </Widget.Root>
  )
}
