import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react"

import { useAtomValue } from "yaasl/react"

import { createContext } from "~/lib/createContext"
import { booleanSort, numberSort, stringSort } from "~/lib/sort"

import { Task, taskList } from "./data"
import { TaskListSettings, useTaskListSettings } from "./settings"

interface ContextState {
  tasks?: Task[]
  addTask: Dispatch<string>
  updateTask: Dispatch<Task>
  removeTask: Dispatch<Task>
  filter: boolean
  setFilter: Dispatch<SetStateAction<boolean>>
  inputValue: string
  setInputValue: Dispatch<string>
}

const { Provider, useRequiredContext } =
  createContext<ContextState>("TaskState")

export const useTaskList = useRequiredContext

const sortByAttribute = {
  checked: booleanSort,
  checkedAt: numberSort,
  createdAt: numberSort,
  label: stringSort,
}

type SortOptions = TaskListSettings["sort"]
const useSortedTasks = (
  tasks: Task[] | undefined,
  sort: NonNullable<SortOptions>
) =>
  useMemo(() => {
    if (!tasks) return
    return [...tasks]
      .sort((a, b) => numberSort("asc")(a.createdAt, b.createdAt))
      .sort((a, b) => {
        const key = sort.key
        // @ts-expect-error 2345
        return sortByAttribute[key](sort.order)(a[key], b[key])
      })
  }, [tasks, sort.key, sort.order])

interface FilterOptions {
  hideChecked: boolean
  filter: boolean
  inputValue: string
}
const useFilteredTasks = (
  tasks: Task[] | undefined,
  { hideChecked, filter, inputValue }: FilterOptions
) =>
  useMemo(() => {
    if (!tasks) return
    return tasks.filter(({ label, checked }) => {
      if (hideChecked && checked) return false
      // eslint-disable-next-line sonarjs/prefer-single-boolean-return -- has worse readability
      if (filter && !label.includes(inputValue)) return false
      return true
    })
  }, [tasks, hideChecked, filter, inputValue])

interface TaskListProviderProps {
  id: string
}
export const TaskListProvider = ({
  id,
  children,
}: PropsWithChildren<TaskListProviderProps>) => {
  const rawTasks = useAtomValue(taskList.atom)[id]
  const [inputValue, setInputValue] = useState("")
  const [filter, setFilter] = useState(false)
  const { sort, hideChecked } = useTaskListSettings(id)

  const sortedTasks = useSortedTasks(rawTasks, sort)
  const filteredTasks = useFilteredTasks(sortedTasks, {
    hideChecked,
    filter,
    inputValue,
  })

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

  return (
    <Provider
      value={{
        tasks: filteredTasks,
        addTask,
        updateTask,
        removeTask,
        filter,
        setFilter,
        inputValue,
        setInputValue,
      }}
    >
      {children}
    </Provider>
  )
}
