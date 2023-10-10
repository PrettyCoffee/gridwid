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

import { HStack } from "~/components/base/Stack"
import { IconButton } from "~/components/IconButton"
import { ListItem } from "~/components/ListItem"
import { MenuButton } from "~/components/MenuButton"
import { NoData } from "~/components/NoData"
import { Checkbox } from "~/components/ui/checkbox"
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
import { BaseWidgetProps } from "../widgetConfig"

const AddItem = () => {
  const { inputValue, setInputValue, filter, setFilter, addTask } =
    useTaskList()

  const handleAdd = () => {
    if (!inputValue) return
    addTask(inputValue)
    setInputValue("")
  }

  return (
    <div className="flex-1 relative flex gap-2">
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
  onChange,
  ...delegated
}: TaskItemProps) => (
  <ListItem.Root compact={compact}>
    <ListItem.Clickable asChild>
      <label className="cursor-pointer">
        <Checkbox
          compact={compact}
          checked={checked}
          onCheckedChange={onChange}
        />
        <ListItem.Caption title={delegated.label} />
      </label>
    </ListItem.Clickable>
    <ListItem.Action
      className="self-start text-destructive-foreground hover:text-destructive-foreground"
      icon={Trash}
      title="Delete task"
      hideTitle
      onClick={onDelete}
    />
  </ListItem.Root>
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

export interface TaskListWidgetProps extends BaseWidgetProps {
  title?: string
}
export const TaskListWidget = ({ id, title }: TaskListWidgetProps) => {
  const settings = useTaskListSettings(id)

  return (
    <Widget.Root>
      {title && (
        <Widget.Header title={title}>
          <TaskListMenu id={id} settings={settings} />
        </Widget.Header>
      )}
      <TaskListProvider id={id}>
        <HStack asChild gap="1">
          <Widget.Content className={cn("my-2", !title && "mt-4")}>
            <AddItem />
            {!title && <TaskListMenu id={id} settings={settings} />}
          </Widget.Content>
        </HStack>
        <Widget.Content scroll expand>
          <TaskList settings={settings} />
        </Widget.Content>
      </TaskListProvider>
    </Widget.Root>
  )
}
