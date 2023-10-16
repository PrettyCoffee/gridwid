import { FC } from "react"

import { LucideIcon } from "lucide-react"

import Image from "./image"
import LinkTree from "./link-tree"
import Repo from "./repo"
import TaskList from "./task-list"

export interface WidgetDefinition<Props extends object> {
  id: string
  name: string
  description: string
  icon: LucideIcon
  component: FC<Props>
}

export const widgets = {
  image: Image,
  "link-tree": LinkTree,
  "github-repo": Repo,
  "task-list": TaskList,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<string, WidgetDefinition<any>>
