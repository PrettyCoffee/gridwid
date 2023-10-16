import { ListTree } from "lucide-react"

import { LinkTreeWidget, LinkTreeWidgetProps } from "./LinkTreeWidget"
import { WidgetDefinition } from "../widgets"

export default {
  id: "link-tree" as const,
  name: "Link Tree",
  description: "Structured list of links",
  icon: ListTree,
  component: LinkTreeWidget,
} satisfies WidgetDefinition<LinkTreeWidgetProps>
