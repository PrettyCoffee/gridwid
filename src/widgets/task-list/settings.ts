import { ArrowDown01, ArrowDownAZ, ArrowUp01, ArrowUpAZ } from "lucide-react"

import { MenuItemGroup } from "~/components/MenuButton"
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

const sortIcons = {
  label: { asc: ArrowDownAZ, desc: ArrowUpAZ },
  checked: { asc: ArrowDown01, desc: ArrowUp01 },
  createdAt: { asc: ArrowDown01, desc: ArrowUp01 },
}

export const getMenuSettings = (
  id: string,
  settings: TaskListSettings
): MenuItemGroup[] => {
  const { sort } = settings

  const changeSort = (key: keyof Task) => {
    const order = sort?.key === key && sort.order === "asc" ? "desc" : "asc"
    taskListSettings.setOption(id, "sort", { key: key, order })
  }

  const getIconByKey = (key: keyof typeof sortIcons) =>
    sort?.key !== key ? undefined : sortIcons[key][sort.order]

  return [
    {
      label: "Behavior",
      items: [
        {
          label: "Compact list",
          keepOpen: true,
          selectable: {
            checked: settings.compactList,
            onChange: checked =>
              taskListSettings.setOption(id, "compactList", checked),
          },
        },
        {
          label: "Hide selected",
          keepOpen: true,
          selectable: {
            checked: settings.hideChecked,
            onChange: checked =>
              taskListSettings.setOption(id, "hideChecked", checked),
          },
        },
        {
          label: "No line wrap",
          keepOpen: true,
          selectable: {
            checked: settings.noWrap,
            onChange: checked =>
              taskListSettings.setOption(id, "noWrap", checked),
          },
        },
        {
          label: "No line wrap (checked)",
          keepOpen: true,
          selectable: {
            checked: settings.checkedNoWrap,
            onChange: checked =>
              taskListSettings.setOption(id, "checkedNoWrap", checked),
          },
        },
      ],
    },
    {
      label: "Sort",
      items: [
        {
          label: "Checked",
          icon: getIconByKey("checked"),
          keepOpen: true,
          onClick: () => changeSort("checked"),
        },
        {
          label: "Alphabetically",
          icon: getIconByKey("label"),
          keepOpen: true,
          onClick: () => changeSort("label"),
        },
        {
          label: "Created at",
          icon: getIconByKey("createdAt"),
          keepOpen: true,
          onClick: () => changeSort("createdAt"),
        },
      ],
    },
  ]
}
