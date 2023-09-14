import { SetStateAction } from "react"

import { atom, localStorage } from "yaasl/react"

import { yaaslSetup } from "~/lib/yaaslSetup"

export interface Task {
  createdAt: number
  label: string
  checked: boolean
  checkedAt?: number
}

yaaslSetup()
const taskListAtom = atom<Record<string, Task[]>>({
  name: "task-list-widget",
  defaultValue: {},
  middleware: [localStorage()],
})

const removeKeyFromObject = <T extends Record<string, unknown>>(
  obj: T,
  key: string
) =>
  Object.fromEntries(
    Object.entries(obj).filter(([currentKey]) => currentKey !== key)
  ) as T

const setList = (listId: string, next: SetStateAction<Task[]>) =>
  taskListAtom.set(allLists => {
    const list = allLists[listId] ?? []
    const nextList = next instanceof Function ? next(list) : next
    if (nextList.length < 1) {
      return removeKeyFromObject(allLists, listId)
    }
    return nextList === list ? allLists : { ...allLists, [listId]: nextList }
  })

const createTask = (label: string): Task => ({
  label,
  checked: false,
  createdAt: Date.now(),
})
const addTask = (listId: string, task: string) => {
  setList(listId, list => [...list, createTask(task)])
}

const updateTask = (listId: string, task: Task) => {
  setList(listId, list => {
    const nextList = [...list]
    const index = nextList.findIndex(
      ({ createdAt }) => createdAt === task.createdAt
    )
    if (index < 0) return list
    nextList[index] = task
    return nextList
  })
}

const removeTask = (listId: string, task: Task) => {
  setList(listId, list =>
    list.filter(({ createdAt }) => createdAt !== task.createdAt)
  )
}

const setAll = (listId: string, set: (task: Task) => Task) =>
  setList(listId, list => list.map(set))

const removeAllWhere = (listId: string, condition: (task: Task) => boolean) =>
  setList(listId, list => list.filter(task => !condition(task)))

type SortRule = (a: Task, b: Task) => number
const sortList = (listId: string, rules: SortRule | SortRule[]) => {
  const ruleArray = Array.isArray(rules) ? rules : [rules]
  setList(listId, tasks =>
    ruleArray.reduce<Task[]>((result, rule) => result.sort(rule), tasks)
  )
}

export const taskList = {
  atom: taskListAtom,
  sortList,
  addTask,
  updateTask,
  removeTask,
  setAll,
  removeAllWhere,
}
