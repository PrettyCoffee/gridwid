import { Slot } from "@radix-ui/react-slot"
import { PropsWithChildren } from "react"

import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { AsChildProp, ClassNameProp } from "../../../types/base-props"
import { CodeEditor, CodeEditorProps } from "../code-editor"
import { MDPreview } from "../md-preview"

const ScrollArea = ({
  className,
  children,
  asChild,
}: PropsWithChildren<ClassNameProp & AsChildProp>) => {
  const Inner = asChild ? Slot : "div"
  return (
    <div className={cn("overflow-hidden", vstack({}), className)}>
      <Inner className="w-full flex-1 overflow-auto">{children}</Inner>
    </div>
  )
}

export type MDEditorProps = Omit<
  CodeEditorProps,
  "rehypePlugins" | "language" | "style"
>

export const MDEditor = ({ className, ...inputProps }: MDEditorProps) => {
  const { value } = inputProps

  return (
    <div
      className={cn(
        hstack({ gap: 4 }),
        "relative size-full flex-1 overflow-hidden",
        className
      )}
    >
      <ScrollArea className="flex-[1_1_50%]">
        <CodeEditor {...inputProps} language="markdown" />
      </ScrollArea>
      <ScrollArea asChild className="flex-[1_1_50%]">
        <MDPreview value={value} />
      </ScrollArea>
    </div>
  )
}
