import {
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignStartVertical,
  Scaling,
} from "lucide-react"

import { MenuItemGroup } from "~/components/MenuButton"

import { createSettingsAtom } from "../createSettingsAtom"

export interface ImageSettings {
  removeStyles?: boolean
  scale?: "100" | "125" | "150"
  horizontalAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "center" | "bottom"
}

const defaultSettings: Required<ImageSettings> = {
  removeStyles: false,
  scale: "100",
  horizontalAlign: "center",
  verticalAlign: "center",
}

export const imageSettings = createSettingsAtom<ImageSettings>(
  "image-widget-settings",
  defaultSettings
)

export const useImageSettings = imageSettings.useSettings

export type Scale = NonNullable<ImageSettings["scale"]>
const nextScale: Record<Scale, Scale> = {
  "100": "125",
  "125": "150",
  "150": "100",
}

export type HorizontalAlign = NonNullable<ImageSettings["horizontalAlign"]>
const nextHorizontalAlign: Record<HorizontalAlign, HorizontalAlign> = {
  left: "center",
  center: "right",
  right: "left",
}

export type VerticalAlign = NonNullable<ImageSettings["verticalAlign"]>
const nextVerticalAlign: Record<VerticalAlign, VerticalAlign> = {
  top: "center",
  center: "bottom",
  bottom: "top",
}

const horizontalAlignIcon = {
  left: AlignStartVertical,
  center: AlignCenterVertical,
  right: AlignEndVertical,
}

const verticalAlignIcon = {
  top: AlignStartHorizontal,
  center: AlignCenterHorizontal,
  bottom: AlignEndHorizontal,
}

export const getMenuSettings = (
  id: string,
  settings: Required<ImageSettings>
): MenuItemGroup[] => [
  {
    label: "Behavior",
    items: [
      {
        label: "Remove background",
        keepOpen: true,
        selectable: {
          checked: settings.removeStyles,
          onChange: checked => {
            imageSettings.setOption(id, "removeStyles", checked)
          },
        },
      },
      {
        label: `Change scale (${settings.scale}%)`,
        icon: Scaling,
        keepOpen: true,
        onClick: () =>
          imageSettings.setOption(id, "scale", nextScale[settings.scale]),
      },
      {
        label: `Horizontal alignment`,
        icon: horizontalAlignIcon[settings.horizontalAlign],
        keepOpen: true,
        onClick: () =>
          imageSettings.setOption(
            id,
            "horizontalAlign",
            nextHorizontalAlign[settings.horizontalAlign]
          ),
      },
      {
        label: `Vertical alignment`,
        icon: verticalAlignIcon[settings.verticalAlign],
        keepOpen: true,
        onClick: () =>
          imageSettings.setOption(
            id,
            "verticalAlign",
            nextVerticalAlign[settings.verticalAlign]
          ),
      },
    ],
  },
]
