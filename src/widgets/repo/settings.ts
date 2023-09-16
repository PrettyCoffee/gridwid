import { MenuItemGroup } from "~/components/MenuButton"

import { createSettingsAtom } from "../createSettingsAtom"

export interface RepoSettings {
  hideOwnerInTitle?: boolean
  hideStats?: boolean
  hideTopics?: boolean
}

const defaultSettings: Required<RepoSettings> = {
  hideOwnerInTitle: false,
  hideStats: false,
  hideTopics: false,
}

export const repoSettings = createSettingsAtom<RepoSettings>(
  "repo-widget-settings",
  defaultSettings
)

export const useRepoSettings = repoSettings.useSettings

export const getMenuItmes = (
  id: string,
  settings: RepoSettings
): MenuItemGroup[] => [
  {
    label: "Behavior",
    items: [
      {
        label: "Hide owner in title",
        keepOpen: true,
        selectable: {
          checked: settings.hideOwnerInTitle,
          onChange: checked => {
            repoSettings.setOption(id, "hideOwnerInTitle", checked)
          },
        },
      },
      {
        label: "Hide stats",
        keepOpen: true,
        selectable: {
          checked: settings.hideStats,
          onChange: checked => repoSettings.setOption(id, "hideStats", checked),
        },
      },
      {
        label: "Hide topics",
        keepOpen: true,
        selectable: {
          checked: settings.hideTopics,
          onChange: checked =>
            repoSettings.setOption(id, "hideTopics", checked),
        },
      },
    ],
  },
]
