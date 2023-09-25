import { useState } from "react"

import { HStack } from "~/components/base/Stack"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import { useLinkTreeData } from "./data"
import { LinkTree } from "./LinkTree"
import { LinkTreeEditor } from "./LinkTreeEditor"

interface LinkTreeWidgetProps {
  id: string
  title?: string
}

export const LinkTreeWidget = ({ id, title }: LinkTreeWidgetProps) => {
  const data = useLinkTreeData(id)
  const [filter, setFilter] = useState("")

  return (
    <Widget.Root>
      {title && (
        <Widget.Header title={title}>
          <LinkTreeEditor id={id} />
        </Widget.Header>
      )}

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
          {!title && <LinkTreeEditor id={id} />}
        </HStack>
        <LinkTree tree={data} filter={filter} />
      </Widget.Content>
    </Widget.Root>
  )
}
