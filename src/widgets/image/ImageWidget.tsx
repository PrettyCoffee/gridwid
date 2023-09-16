import { useState } from "react"

import { ImageOff, MoreVertical } from "lucide-react"

import { Icon } from "~/components/Icon"
import { MenuButton } from "~/components/MenuButton"
import { Text } from "~/components/Text"
import { Widget } from "~/components/Widget"
import { cn } from "~/lib/utils"

import {
  HorizontalAlign,
  Scale,
  VerticalAlign,
  getMenuSettings,
  useImageSettings,
} from "./settings"

const getScale = (scale: Scale) => {
  switch (scale) {
    case "125":
      return "scale-125"
    case "150":
      return "scale-150"
    case "100":
    default:
      return "scale-100"
  }
}

/* eslint-disable sonarjs/no-nested-switch, no-fallthrough */
const getAlignment = (horizontal: HorizontalAlign, vertical: VerticalAlign) => {
  switch (horizontal) {
    case "left":
      switch (vertical) {
        case "top":
          return "object-left-top"
        case "center":
          return "object-left"
        case "bottom":
          return "object-left-bottom"
      }
    case "center":
      switch (vertical) {
        case "top":
          return "object-top"
        case "center":
          return "object-center"
        case "bottom":
          return "object-bottom"
      }
    case "right":
      switch (vertical) {
        case "top":
          return "object-right-top"
        case "center":
          return "object-right"
        case "bottom":
          return "object-right-bottom"
      }
  }
}
/* eslint-enable */

interface ImageWidgetProps {
  id: string
  src: string
}

export const ImageWidget = ({ id, src }: ImageWidgetProps) => {
  const [error, setError] = useState(false)
  const settings = useImageSettings(id)

  if (error) {
    return (
      <Widget.Root className="flex items-center justify-center flex-col gap-2">
        <Icon
          icon={ImageOff}
          color="muted"
          className="h-20 w-20 max-w-full max-h-full"
        />
        <Text color="muted">Image not available</Text>
      </Widget.Root>
    )
  }

  return (
    <Widget.Root
      className={cn(
        "overflow-hidden",
        settings.removeStyles && "bg-transparent border-none shadow-none"
      )}
    >
      <img
        src={src}
        alt=""
        onError={() => setError(true)}
        className={cn(
          "w-full h-full object-cover",
          getScale(settings.scale),
          getAlignment(settings.horizontalAlign, settings.verticalAlign)
        )}
      />
      <MenuButton
        className="absolute top-2 right-2 opacity-50"
        icon={MoreVertical}
        title="Widget settings"
        titleSide="left"
        items={getMenuSettings(id, settings)}
      />
    </Widget.Root>
  )
}
