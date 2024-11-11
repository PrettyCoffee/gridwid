import { parse } from "marked"

import { ClassNameProp } from "../../../types/base-props"
import { cn } from "../../../utils/cn"

const adjustForRender = (text: string) => {
  return text.replace(/^(#+)/gm, "#$1")
}

export interface MDPreviewProps extends ClassNameProp {
  value: string
}

export const MDPreview = ({ value = "", className }: MDPreviewProps) => {
  return (
    <div
      className={cn("prose dark:prose-invert prose-zinc", className)}
      dangerouslySetInnerHTML={{
        __html: parse(adjustForRender(value)) as string,
      }}
    />
  )
}
