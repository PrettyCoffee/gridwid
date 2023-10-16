import { ListTodo } from "lucide-react"

import { TaskListWidget, TaskListWidgetProps } from "./TaskListWidget"
import { WidgetDefinition } from "../widgets"

export default {
  id: "task-list" as const,
  name: "Task List",
  description: "List of to-do items",
  icon: ListTodo,
  component: TaskListWidget,
} satisfies WidgetDefinition<TaskListWidgetProps>
