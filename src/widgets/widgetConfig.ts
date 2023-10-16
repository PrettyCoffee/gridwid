import { ImageWidgetProps } from "./image/ImageWidget"
import { LinkTreeWidgetProps } from "./link-tree/LinkTreeWidget"
import { RepoWidgetProps } from "./repo/RepoWidget"
import { TaskListWidgetProps } from "./task-list/TaskListWidget"
import { widgets } from "./widgets"

export interface BaseWidgetProps {
  id: string
}
type WidgetId = keyof typeof widgets
export interface WidgetConfig<
  Props extends BaseWidgetProps = BaseWidgetProps,
  Widget extends WidgetId = WidgetId
> {
  size: { columns: number; rows: number }
  widget: Widget
  props: Props
}

type RepoWidgetConfig = WidgetConfig<RepoWidgetProps, "github-repo">
type ImageWidgetConfig = WidgetConfig<ImageWidgetProps, "image">
type TaskListWidgetConfig = WidgetConfig<TaskListWidgetProps, "task-list">
type LinkTreeWidgetConfig = WidgetConfig<LinkTreeWidgetProps, "link-tree">

export type WidgetConfigList = (
  | RepoWidgetConfig
  | ImageWidgetConfig
  | TaskListWidgetConfig
  | LinkTreeWidgetConfig
)[]
