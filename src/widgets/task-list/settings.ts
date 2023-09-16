import { SortOrder } from "~/lib/sort"

import { Task } from "./data"
import { createSettingsAtom } from "../createSettingsAtom"

export interface TaskListSettings {
  hideChecked?: boolean
  compactList?: boolean
  noWrap?: boolean
  checkedNoWrap?: boolean
  sort?: {
    key: keyof Task
    order: SortOrder
  }
}

const defaultSettings: Required<TaskListSettings> = {
  hideChecked: false,
  compactList: false,
  noWrap: false,
  checkedNoWrap: true,
  sort: {
    key: "checked",
    order: "asc",
  },
}

export const taskListSettings = createSettingsAtom<TaskListSettings>(
  "task-list-settings",
  defaultSettings
)

export const useTaskListSettings = taskListSettings.useSettings
