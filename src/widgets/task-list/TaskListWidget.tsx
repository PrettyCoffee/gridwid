import { Dispatch, useCallback, useMemo, useState } from "react"

import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp01,
  ArrowUpAZ,
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
  taskListSettings,
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
  sortBy: NonNullable<TaskListSettings["sort"]>
) => {
  const tasks = useAtomValue(taskList.atom)[id]

  const sortedTasks = useMemo(
    () =>
      tasks
        ?.sort((a, b) => numberSort("asc")(a.createdAt, b.createdAt))
        .sort((a, b) => {
          const key = sortBy.key
          // @ts-expect-error 2345
          return sortByAttribute[key](sortBy.order)(a[key], b[key])
        }),
    [tasks, sortBy.key, sortBy.order]
  )

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

  return { tasks: sortedTasks, addTask, updateTask, removeTask }
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

/** TODO: Settings
  Actions
    x Check all
    x Uncheck all
    x Delete all
    X Delete all checked
  Behavior
    - [ ] hide checked
    - [ ] delete when checked
  Sort by
    x (↑↓ ) alphabetically
    x (↑↓ ) checked
    x (↑↓ ) last created
  Design
    - [ ] compact
    - [ ] force one line
    - [ ] force one line when checked
 */

const sortIcons = {
  label: { asc: ArrowDownAZ, desc: ArrowUpAZ },
  checked: { asc: ArrowDown01, desc: ArrowUp01 },
  createdAt: { asc: ArrowDown01, desc: ArrowUp01 },
}

const TaskListMenu = ({
  id,
  settings,
}: {
  id: string
  settings: TaskListSettings
}) => {
  const { sort } = settings

  const changeSort = (key: keyof Task) => {
    const order = sort?.key === key && sort.order === "asc" ? "desc" : "asc"
    taskListSettings.setOption(id, "sort", { key: key, order })
  }
  const getKey = (key: keyof typeof sortIcons) =>
    sort?.key !== key ? undefined : sortIcons[key][sort.order]

  return (
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
              label: "Delete all selected",
              icon: Trash,
              destructive: true,
              onClick: () => removeAllChecked(id),
            },
          ],
        },
        {
          label: "Sort",
          items: [
            {
              label: "Checked",
              icon: getKey("checked"),
              keepOpen: true,
              onClick: () => changeSort("checked"),
            },
            {
              label: "Alphabetically",
              icon: getKey("label"),
              keepOpen: true,
              onClick: () => changeSort("label"),
            },
            {
              label: "Created at",
              icon: getKey("createdAt"),
              keepOpen: true,
              onClick: () => changeSort("createdAt"),
            },
          ],
        },
      ]}
    />
  )
}

interface TaskItemProps extends Task {
  onChange: Dispatch<boolean>
  onDelete: () => void
  compact?: boolean
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
      noWrap={checked}
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
  const { tasks, addTask, updateTask, removeTask } = useTasks(id, settings.sort)

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
              key={task.label}
              {...task}
              onChange={checked => changeTask(task, checked)}
              onDelete={() => removeTask(task)}
            />
          ))}
        </Widget.Content>
      )}
    </Widget.Root>
  )
}
