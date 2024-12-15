import { Slot } from "@radix-ui/react-slot"
import { Code, LetterText, SquareSplitHorizontal } from "lucide-react"
import { PropsWithChildren, useState } from "react"

import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { AsChildProp, ClassNameProp } from "../../../types/base-props"
import { CodeEditor, CodeEditorProps } from "../code-editor"
import { MDPreview } from "../md-preview"
import { StateSwitch } from "../state-switch"

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

type EditorMode = "code" | "split" | "preview"

export interface MDEditorProps
  extends Omit<CodeEditorProps, "rehypePlugins" | "language" | "style"> {
  initialMode?: EditorMode
}

export const MDEditor = ({ className, ...inputProps }: MDEditorProps) => {
  const { value } = inputProps
  const [mode, setMode] = useState<EditorMode>("split")

  return (
    <div
      className={cn(
        hstack({ gap: 4 }),
        "relative size-full flex-1 overflow-hidden",
        className
      )}
    >
      <div className="absolute right-1 top-1 z-50">
        <StateSwitch.Group
          current={mode}
          onChange={value => setMode(value as EditorMode)}
          size="sm"
        >
          <StateSwitch.Option label={"Code"} value={"code"} icon={Code} />
          <StateSwitch.Option
            label={"Split view"}
            value={"split"}
            icon={SquareSplitHorizontal}
          />
          <StateSwitch.Option
            label={"Preview"}
            value={"preview"}
            icon={LetterText}
          />
        </StateSwitch.Group>
      </div>

      <ScrollArea
        className={cn(
          { code: "flex-1", split: "flex-[1_1_50%]", preview: "hidden" }[mode]
        )}
      >
        <CodeEditor {...inputProps} language="markdown" />
      </ScrollArea>

      <ScrollArea
        asChild
        className={cn(
          "items-stretch",
          { code: "hidden", split: "flex-[1_1_50%]", preview: "flex-1" }[mode]
        )}
      >
        <MDPreview value={value} />
      </ScrollArea>
    </div>
  )
}
