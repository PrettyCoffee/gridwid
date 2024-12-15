import { Slot } from "@radix-ui/react-slot"
import { Code, LetterText, SquareSplitHorizontal } from "lucide-react"
import { PropsWithChildren, useState } from "react"

import { AsChildProp, ClassNameProp, StyleProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { CodeEditor, CodeEditorProps } from "../code-editor"
import { MDPreview } from "../md-preview"
import { StateSwitch } from "../state-switch"

const ScrollArea = ({
  className,
  children,
  asChild,
  style,
}: PropsWithChildren<ClassNameProp & AsChildProp & StyleProp>) => {
  const Inner = asChild ? Slot : "div"
  return (
    <div style={style} className={cn("overflow-hidden", vstack({}), className)}>
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

  const codeWidth = { code: 100, split: 50, preview: 0 }[mode]
  const previewWidth = { code: 0, split: 50, preview: 100 }[mode]

  return (
    <div
      className={cn(
        hstack({ gap: 0 }),
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
          "transition-all duration-300",
          mode === "split" ? "pr-2" : "pr-0"
        )}
        style={{
          flexGrow: codeWidth ? 1 : 0,
          flexShrink: codeWidth ? 1 : 0,
          flexBasis: `${codeWidth}%`,
        }}
      >
        <CodeEditor {...inputProps} language="markdown" />
      </ScrollArea>

      <ScrollArea
        asChild
        className={cn(
          "transition-all duration-300",
          mode === "split" ? "pl-2" : "pl-0"
        )}
        style={{
          flexGrow: previewWidth ? 1 : 0,
          flexShrink: previewWidth ? 1 : 0,
          flexBasis: `${previewWidth}%`,
        }}
      >
        <MDPreview value={value} className="max-w-none" />
      </ScrollArea>
    </div>
  )
}
