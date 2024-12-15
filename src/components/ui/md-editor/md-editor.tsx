import { Slot } from "@radix-ui/react-slot"
import { css } from "goober"
import { Code, LetterText } from "lucide-react"
import { Dispatch, PropsWithChildren, useState } from "react"

import { AsChildProp, ClassNameProp, StyleProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { CodeEditor, CodeEditorProps } from "../code-editor"
import { IconButton } from "../icon-button"
import { MDPreview } from "../md-preview"

const trackStyles = `
  color: inherit;
  background: currentColor;
  height: 0.25rem;
  border-radius: 50vh;
`

const thumbStyles = `
  color: inherit;
  appearance: none;
  height: var(--slider-size);
  width: var(--slider-size);
  background: black;
  outline: 2px solid currentColor;
  margin-top: -0.4rem;
  border-radius: 50%;
  border: none;
`

const slider = css`
  --slider-size: 1rem;

  appearance: none;
  display: inline-block;
  background: transparent;
  width: 100%;
  cursor: pointer;
  height: 1.5rem;
  border-radius: 0.25rem;

  &::-moz-range-track {
    ${trackStyles}
  }
  &::-moz-range-thumb {
    ${thumbStyles}
  }

  input[type="range"]& {
    &::-webkit-slider-runnable-track {
      ${trackStyles}
    }
    &::-webkit-slider-thumb {
      ${thumbStyles}
    }
  }
`

const ModeSlider = ({
  value,
  onChange,
}: {
  value: number
  onChange: Dispatch<number>
}) => {
  return (
    <div
      className={cn(
        hstack({ gap: 1, align: "center" }),
        "bg-background/75 border-stroke w-36 rounded-full border backdrop-blur-sm"
      )}
    >
      <IconButton
        title="Show preview"
        icon={LetterText}
        size="sm"
        className="rounded-full"
        onClick={() => onChange(0)}
      />
      <input
        type="range"
        min="20"
        max="80"
        value={value}
        onChange={({ target }) => onChange(Number(target.value))}
        className={cn("text-stroke-button/75 hover:text-stroke-button", slider)}
      />
      <IconButton
        title="Show code"
        icon={Code}
        size="sm"
        className="rounded-full"
        onClick={() => onChange(100)}
      />
    </div>
  )
}

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

export interface MDEditorProps
  extends Omit<CodeEditorProps, "rehypePlugins" | "language" | "style"> {
  inputClassName?: string
  previewClassName?: string
}

export const MDEditor = ({
  className,
  inputClassName,
  previewClassName,
  ...inputProps
}: MDEditorProps) => {
  const { value } = inputProps
  const [modeValue, setModeValue] = useState(50)

  const codeWidth = modeValue
  const previewWidth = 100 - modeValue

  const showCode = codeWidth > 20
  const showPreview = previewWidth > 20

  return (
    <div
      className={cn(
        hstack({}),
        "relative size-full flex-1 overflow-hidden",
        className
      )}
    >
      <div className="absolute right-2 top-1 z-50">
        <ModeSlider value={modeValue} onChange={setModeValue} />
      </div>

      <ScrollArea
        className={cn(!showCode && "hidden")}
        style={{ flex: `1 1 ${codeWidth}%` }}
      >
        <CodeEditor
          {...inputProps}
          language="markdown"
          className={inputClassName}
        />
      </ScrollArea>

      <ScrollArea
        className={cn(!showPreview && "hidden")}
        style={{ flex: `1 1 ${previewWidth}%` }}
      >
        <MDPreview
          value={value}
          className={cn(
            "max-w-none pl-4 pt-1",
            showCode && "border-stroke-gentle ml-4 border-l",
            previewClassName
          )}
        />
      </ScrollArea>
    </div>
  )
}
