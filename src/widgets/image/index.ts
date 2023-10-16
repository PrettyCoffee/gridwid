import { Image } from "lucide-react"

import { ImageWidget, ImageWidgetProps } from "./ImageWidget"
import { WidgetDefinition } from "../widgets"

export default {
  id: "image" as const,
  name: "Image",
  description: "Image decorator",
  icon: Image,
  component: ImageWidget,
} satisfies WidgetDefinition<ImageWidgetProps>
