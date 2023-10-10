import { FC } from "react"

import { ImageWidgetProps } from "./image/ImageWidget"
import { LinkTreeWidgetProps } from "./link-tree/LinkTreeWidget"
import { RepoWidgetProps } from "./repo/RepoWidget"
import { TaskListWidgetProps } from "./task-list/TaskListWidget"

export interface BaseWidgetProps {
  id: string
}
export interface WidgetConfig<Props extends BaseWidgetProps = BaseWidgetProps> {
  size: { columns: number; rows: number }
  component: FC<Props>
  props: Props
}

type RepoWidgetConfig = WidgetConfig<RepoWidgetProps>
type ImageWidgetConfig = WidgetConfig<ImageWidgetProps>
type TaskListWidgetConfig = WidgetConfig<TaskListWidgetProps>
type LinkTreeWidgetConfig = WidgetConfig<LinkTreeWidgetProps>

export type WidgetConfigList = (
  | RepoWidgetConfig
  | ImageWidgetConfig
  | TaskListWidgetConfig
  | LinkTreeWidgetConfig
)[]
