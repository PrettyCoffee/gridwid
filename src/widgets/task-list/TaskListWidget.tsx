import { Dispatch, useCallback, useMemo, useState } from "react"

import {
  CheckCheck,
  CopyCheck,
  CopyMinus,
  MoreVertical,
  Plus,
  Trash,
} from "lucide-react"
import { useAtomValue } from "yaasl/react"

import { Icon } from "~/components/Icon"
import { IconButton } from "~/components/IconButton"
import { MenuButton } from "~/components/MenuButton"
import { Text } from "~/components/Text"
import { CheckboxWithLabel } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Widget } from "~/components/Widget"
import { booleanSort, numberSort, stringSort } from "~/lib/sort"
import { cn } from "~/lib/utils"

import { Task, taskList } from "./data"
import {
  getMenuSettings,
  TaskListSettings,
  useTaskListSettings,
} from "./settings"

const sortByAttribute = {
  checked: booleanSort,
  checkedAt: numberSort,
  createdAt: numberSort,
  label: stringSort,
}

const useTasks = (
  id: string,
  { sort, hideChecked }: Required<TaskListSettings>
) => {
  const rawTasks = useAtomValue(taskList.atom)[id]

  const tasks = useMemo(() => {
    const sorted = rawTasks
      ?.sort((a, b) => numberSort("asc")(a.createdAt, b.createdAt))
      .sort((a, b) => {
        const key = sort.key
        // @ts-expect-error 2345
        return sortByAttribute[key](sort.order)(a[key], b[key])
      })
    return !hideChecked ? sorted : sorted?.filter(({ checked }) => !checked)
  }, [rawTasks, sort.key, sort.order, hideChecked])

  const addTask = useCallback(
    (label: string) => taskList.addTask(id, label),
    [id]
  )

  const updateTask = useCallback(
    (task: Task) => taskList.updateTask(id, task),
    [id]
  )

  const removeTask = useCallback(
    (task: Task) => taskList.removeTask(id, task),
    [id]
  )

  return { tasks, addTask, updateTask, removeTask }
}

interface AddItemProps {
  onAdd: Dispatch<string>
}
const AddItem = ({ onAdd }: AddItemProps) => {
  const [value, setValue] = useState("")

  const addTask = () => {
    if (!value) return
    onAdd(value)
    setValue("")
  }

  return (
    <div className="relative flex gap-2">
      <Input
        className="pr-12"
        placeholder="Task label"
        value={value}
        onChange={({ target }) => setValue(target.value)}
        onKeyDown={({ key }) => key === "Enter" && addTask()}
      />
      <IconButton
        className="absolute top-0 bottom-0 right-0"
        icon={Plus}
        title="Add task"
        onClick={addTask}
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

interface TaskListWidgetProps {
  id: string
  title: string
}
export const TaskListWidget = ({ id, title }: TaskListWidgetProps) => {
  const settings = useTaskListSettings(id)
  const { tasks, addTask, updateTask, removeTask } = useTasks(id, settings)

  const changeTask = (task: Task, checked: boolean) =>
    updateTask({
      ...task,
      checked,
      checkedAt: checked ? Date.now() : undefined,
    })

  return (
    <Widget.Root>
      <Widget.Header title={title}>
        <TaskListMenu id={id} settings={settings} />
      </Widget.Header>
      <Widget.Content className="py-4 sticky top-9 bg-card z-10">
        <AddItem onAdd={addTask} />
      </Widget.Content>
      {!tasks ? (
        <NoTasks />
      ) : (
        <Widget.Content>
          {tasks.map(task => (
            <TaskItem
              key={task.createdAt}
              {...task}
              onChange={checked => changeTask(task, checked)}
              onDelete={() => removeTask(task)}
              compact={settings.compactList}
              noWrap={
                settings.noWrap || (settings.checkedNoWrap && task.checked)
              }
            />
          ))}
        </Widget.Content>
      )}
    </Widget.Root>
  )
}
