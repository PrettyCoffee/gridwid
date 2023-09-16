import { createDataAtom } from "../createDataAtom"

export interface Task {
  createdAt: number
  label: string
  checked: boolean
  checkedAt?: number
}

const data = createDataAtom<Task[]>("task-list-widget", [])

const createTask = (label: string): Task => ({
  label,
  checked: false,
  createdAt: Date.now(),
})
const addTask = (listId: string, task: string) => {
  data.setData(listId, list => [...list, createTask(task)])
}

const updateTask = (listId: string, task: Task) => {
  data.setData(listId, list => {
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
  data.setData(listId, list =>
    list.filter(({ createdAt }) => createdAt !== task.createdAt)
  )
}

const setAll = (listId: string, set: (task: Task) => Task) =>
  data.setData(listId, list => list.map(set))

const removeAllWhere = (listId: string, condition: (task: Task) => boolean) =>
  data.setData(listId, list => list.filter(task => !condition(task)))

export const useTaskListData = data.useData

export const taskList = {
  atom: data.atom,
  addTask,
  updateTask,
  removeTask,
  setAll,
  removeAllWhere,
}
