import { Dispatch } from "react"

import {
  CheckCheck,
  CopyCheck,
  CopyMinus,
  Filter,
  FilterX,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react"

import { IconButton } from "~/components/IconButton"
import { MenuButton } from "~/components/MenuButton"
import { NoData } from "~/components/NoData"
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
        title={`${filter ? "Disable" : "Enable"} filtering`}
        onClick={() => setFilter(v => !v)}
        hideTitle
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
        title="Add task to list"
        hideTitle
        onClick={handleAdd}
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
    title="Tasklist widget settings"
    hideTitle
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
  <div className={cn("flex max-w-full", compact ? "rounded-sm" : "rounded-md")}>
    <CheckboxWithLabel
      compact={compact}
      className={cn("flex-1", checked && "text-muted-foreground line-through")}
      checked={checked}
      {...delegated}
    />
    <IconButton
      className="flex text-destructive-foreground hover:text-destructive-foreground [:not(:hover)>&]:opacity-0 [:not(:hover)>&]:w-0 [:not(:hover)>&]:min-w-0"
      icon={Trash}
      title="Delete task"
      hideTitle
      onClick={onDelete}
      compact={compact}
    />
  </div>
)

interface TaskListProps {
  settings: TaskListSettings
}
const TaskList = ({ settings }: TaskListProps) => {
  const { tasks, updateTask, removeTask } = useTaskList()

  if (!tasks)
    return <NoData icon={CheckCheck} message="There is nothing to do!" />

  if (tasks.length === 0)
    return <NoData icon={FilterX} message="No task found." />

  const changeChecked = (task: Task, checked: boolean) =>
    updateTask({
      ...task,
      checked,
      checkedAt: checked ? Date.now() : undefined,
    })

  return (
    <>
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
    </>
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
        <Widget.Content className="my-2">
          <AddItem />
        </Widget.Content>
        <Widget.Content scroll expand>
          <TaskList settings={settings} />
        </Widget.Content>
      </TaskListProvider>
    </Widget.Root>
  )
}
