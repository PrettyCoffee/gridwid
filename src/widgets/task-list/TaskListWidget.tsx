import { Dispatch } from "react"

import {
  CheckCheck,
  CopyCheck,
  CopyMinus,
  Filter,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react"

import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { MenuButton } from "~/components/MenuButton"
import { Text } from "~/components/Text"
import { CheckboxWithLabel } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import { Task, taskList } from "./data"
import {
  getMenuSettings,
  TaskListSettings,
  useTaskListSettings,
} from "./settings"
import { TaskListProvider, useTaskList } from "./TaskProvider"

const AddItem = () => {
  const { inputValue, setInputValue, filter, setFilter, addTask } =
    useTaskList()

  const handleAdd = () => {
    if (!inputValue) return
    addTask(inputValue)
    setInputValue("")
  }

  return (
    <div className="relative flex gap-2">
      <IconButton
        className={cn(
          "absolute top-0 bottom-0 left-0",
          filter && "[&>svg]:fill-accent-foreground"
        )}
        icon={Filter}
        title="Enable filter"
        onClick={() => setFilter(v => !v)}
        titleSide="left"
      />
      <Input
        className="px-12"
        placeholder="Task label"
        value={inputValue}
        onChange={({ target }) => setInputValue(target.value)}
        onKeyDown={({ key }) => key === "Enter" && handleAdd()}
      />
      <IconButton
        className="absolute top-0 bottom-0 right-0"
        icon={Plus}
        title="Add task"
        onClick={handleAdd}
        titleSide="right"
      />
    </div>
  )
}

const checkAll = (id: string, checked: boolean) =>
  taskList.setAll(id, task => ({ ...task, checked }))

const removeAll = (id: string) => taskList.removeAllWhere(id, () => true)

const removeAllChecked = (id: string) =>
  taskList.removeAllWhere(id, task => task.checked)

const TaskListMenu = ({
  id,
  settings,
}: {
  id: string
  settings: TaskListSettings
}) => (
  <MenuButton
    icon={MoreVertical}
    title="Widget settings"
    titleSide="left"
    items={[
      {
        label: "Actions",
        items: [
          {
            label: "Select all",
            icon: CopyCheck,
            onClick: () => checkAll(id, true),
          },
          {
            label: "Unselect all",
            icon: CopyMinus,
            onClick: () => checkAll(id, false),
          },
          {
            label: "Delete all",
            icon: Trash,
            destructive: true,
            onClick: () => removeAll(id),
          },
          {
            label: "Delete selected",
            icon: Trash,
            destructive: true,
            onClick: () => removeAllChecked(id),
          },
        ],
      },
      ...getMenuSettings(id, settings),
    ]}
  />
)

interface TaskItemProps extends Task {
  onChange: Dispatch<boolean>
  onDelete: () => void
  compact?: boolean
  noWrap?: boolean
}
const TaskItem = ({
  checked,
  onDelete,
  compact,
  ...delegated
}: TaskItemProps) => (
  <div className="flex max-w-full">
    <CheckboxWithLabel
      size={compact ? "compact" : "default"}
      className={cn("flex-1", checked && "text-muted-foreground line-through")}
      checked={checked}
      {...delegated}
    />
    <IconButton
      className="hidden [:hover>&]:flex text-destructive-foreground hover:text-destructive-foreground"
      icon={Trash}
      title="Delete task"
      onClick={onDelete}
      titleSide="right"
      compact={compact}
    />
  </div>
)

const NoTasks = () => (
  <div className="h-full w-full flex flex-col gap-4 items-center justify-center">
    <Icon icon={CheckCheck} color="muted" className="h-20 w-20" />
    <Text color="muted">There is nothing to do!</Text>
  </div>
)

interface TaskListProps {
  settings: TaskListSettings
}
const TaskList = ({ settings }: TaskListProps) => {
  const { tasks, updateTask, removeTask } = useTaskList()

  if (!tasks) return <NoTasks />

  const changeChecked = (task: Task, checked: boolean) =>
    updateTask({
      ...task,
      checked,
      checkedAt: checked ? Date.now() : undefined,
    })

  return (
    <Widget.Content>
      {tasks.map(task => (
        <TaskItem
          key={task.createdAt}
          {...task}
          onChange={checked => changeChecked(task, checked)}
          onDelete={() => removeTask(task)}
          compact={settings.compactList}
          noWrap={settings.noWrap || (settings.checkedNoWrap && task.checked)}
        />
      ))}
    </Widget.Content>
  )
}

interface TaskListWidgetProps {
  id: string
  title: string
}
export const TaskListWidget = ({ id, title }: TaskListWidgetProps) => {
  const settings = useTaskListSettings(id)

  return (
    <Widget.Root>
      <Widget.Header title={title}>
        <TaskListMenu id={id} settings={settings} />
      </Widget.Header>
      <TaskListProvider id={id}>
        <Widget.Content className="py-4 sticky top-9 bg-card z-10">
          <AddItem />
        </Widget.Content>
        <TaskList settings={settings} />
      </TaskListProvider>
    </Widget.Root>
  )
}
