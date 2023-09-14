import { Dispatch, useCallback, useState } from "react"

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
import { autoSort, createObjectSort } from "~/lib/autoSort"
import { cn } from "~/lib/utils"

import { Task, taskList } from "./data"

const useTasks = (id: string) => {
  const tasks = useAtomValue(taskList.atom)[id]

  const addTask = useCallback(
    (task: string) => taskList.addTask(id, task),
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
    - (↑↓ ) alphabetically
    - (↑↓ ) checked
    - (↑↓ ) last created
    - (↑↓ ) last checked
  Design
    - [ ] compact
    - [ ] force one line
    - [ ] force one line when checked
 */

const TaskListSettings = ({ id }: { id: string }) => (
  <MenuButton
    icon={MoreVertical}
    title="Widget settings"
    titleSide="left"
    items={[
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
        iconColor: "destructive",
        onClick: () => removeAll(id),
      },
      {
        label: "Delete all selected",
        icon: Trash,
        iconColor: "destructive",
        onClick: () => removeAllChecked(id),
      },
    ]}
  />
)

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

const createdAtSort = createObjectSort<Task>("createdAt", "number", "desc")
const sortTasks = (tasks: Task[]) => {
  const presorted = tasks.sort(createdAtSort)
  return autoSort(presorted, "checked", "desc")
}

interface TaskListWidgetProps {
  id: string
  title: string
}
export const TaskListWidget = ({ id, title }: TaskListWidgetProps) => {
  const { tasks, addTask, updateTask, removeTask } = useTasks(id)

  const changeTask = (task: Task, checked: boolean) =>
    updateTask({
      ...task,
      checked,
      checkedAt: checked ? Date.now() : undefined,
    })

  return (
    <Widget.Root>
      <Widget.Header title={title}>
        <TaskListSettings id={id} />
      </Widget.Header>
      <Widget.Content className="py-4 sticky top-9 bg-card z-10">
        <AddItem onAdd={addTask} />
      </Widget.Content>
      {!tasks ? (
        <NoTasks />
      ) : (
        <Widget.Content>
          {sortTasks(tasks).map(task => (
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
