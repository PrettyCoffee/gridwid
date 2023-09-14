import { SetStateAction, useMemo } from "react"

import { atom, localStorage, useAtomValue } from "yaasl/react"

import { SortOrder } from "~/lib/sort"
import { yaaslSetup } from "~/lib/yaaslSetup"

import { Task } from "./data"

export interface TaskListSettings {
  hideChecked?: boolean
  deleteChecked?: boolean
  sort?: {
    key: keyof Task
    order: SortOrder
  }
}

yaaslSetup()
const settingsAtom = atom<Record<string, TaskListSettings>>({
  name: "task-list-settings",
  defaultValue: {},
  middleware: [localStorage()],
})

const defaultSettings: Required<TaskListSettings> = {
  hideChecked: false,
  deleteChecked: false,
  sort: {
    key: "checked",
    order: "asc",
  },
}

const removeKeyFromObject = <T extends Record<string, unknown>>(
  obj: T,
  key: string
) =>
  Object.fromEntries(
    Object.entries(obj).filter(([currentKey]) => currentKey !== key)
  ) as T

const setSettings = (listId: string, next: SetStateAction<TaskListSettings>) =>
  settingsAtom.set(allSettings => {
    const settings = allSettings[listId] ?? {}
    const nextSettings = next instanceof Function ? next(settings) : next
    if (Object.entries(nextSettings).length < 1) {
      return removeKeyFromObject(allSettings, listId)
    }
    return { ...allSettings, [listId]: nextSettings }
  })

const isDefault = (settings: TaskListSettings, key: keyof TaskListSettings) =>
  key === "sort"
    ? settings.sort?.key === defaultSettings.sort.key &&
      settings.sort.order === defaultSettings.sort.order
    : settings[key] === defaultSettings[key]

const setOption = <K extends keyof TaskListSettings>(
  listId: string,
  key: K,
  value: TaskListSettings[K]
) =>
  setSettings(listId, settings => {
    const nextSettings = { ...settings, [key]: value }
    if (isDefault(nextSettings, key)) {
      return removeKeyFromObject(nextSettings, key)
    }
    return nextSettings
  })

const getOption = <K extends keyof TaskListSettings>(
  listId: string,
  key: K
): TaskListSettings[K] =>
  settingsAtom.get()[listId]?.[key] ?? defaultSettings[key]

export const taskListSettings = {
  atom: settingsAtom,
  setOption,
  getOption,
}

export const useTaskListSettings = (id: string) => {
  const settings = useAtomValue(settingsAtom)[id]
  return useMemo(() => ({ ...defaultSettings, ...settings }), [settings])
}
