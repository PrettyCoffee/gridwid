import { Slot } from "@radix-ui/react-slot"
import { css } from "goober"
import { Code, LetterText, Maximize, Minimize } from "lucide-react"
import { Dispatch, PropsWithChildren, useState } from "react"

import { AsChildProp, ClassNameProp, StyleProp } from "types/base-props"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { KeyEventDispatcher } from "../../../utils/key-event-dispatcher"
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
  cursor: pointer;
  height: 2rem;
  border-radius: 0.25rem;

  width: 5rem;
  transition: width 150ms ease-out;

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

const snapOffset = 15

const ModeSlider = ({
  value,
  onChange,
  size,
}: {
  value: number
  onChange: Dispatch<number>
  size: "sm" | "md"
}) => {
  const handleChange = (stringValue: string) => {
    const value = Number(stringValue)
    if (value < snapOffset) {
      onChange(0)
    } else if (value > 50 - snapOffset / 2 && value < 50 + snapOffset / 2) {
      onChange(50)
    } else if (value > 100 - snapOffset) {
      onChange(100)
    } else {
      onChange(value)
    }
  }

  const keyEvents = new KeyEventDispatcher({})
    .afterAll(({ event }) => event.preventDefault())
    .listen({
      key: ["ArrowRight", "ArrowUp"],
      handler: ({ event }) => {
        const value = Number((event.target as HTMLInputElement).value)
        if (value === 0) {
          onChange(snapOffset)
        } else if (value + 1 > 100 - snapOffset) {
          onChange(100)
        } else {
          onChange(value + 1)
        }
      },
    })
    .listen({
      key: ["ArrowLeft", "ArrowDown"],
      handler: ({ event }) => {
        const value = Number((event.target as HTMLInputElement).value)
        if (value === 100) {
          onChange(100 - snapOffset)
        } else if (value - 1 < snapOffset) {
          onChange(0)
        } else {
          onChange(value - 1)
        }
      },
    })

  return (
    <div className={cn(hstack({ gap: 1, align: "center" }))}>
      <IconButton
        title="Show preview"
        icon={LetterText}
        size={size}
        onClick={() => onChange(0)}
        active={value < 100}
        style={{
          filter: `saturate(${100 - value}%)`,
        }}
      />
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={({ target }) => handleChange(target.value)}
        className={cn("text-stroke-button/75 hover:text-stroke-button", slider)}
        onKeyDown={event => keyEvents.emit(event)}
        style={{
          width: size === "sm" ? "5rem" : "8rem",
        }}
      />
      <IconButton
        title="Show code"
        icon={Code}
        size={size}
        onClick={() => onChange(100)}
        active={value > 0}
        style={{
          filter: `saturate(${value}%)`,
        }}
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
  extends Omit<
    CodeEditorProps,
    "rehypePlugins" | "language" | "style" | "showLineNumbers"
  > {
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
  const [viewMode, setViewMode] = useState<"inline" | "fullscreen">("inline")

  const codeWidth = modeValue
  const previewWidth = 100 - modeValue

  const showCode = modeValue > 0
  const showPreview = modeValue < 100

  return (
    <div
      className={cn(
        hstack({}),
        "flex-1 overflow-hidden pt-10",
        viewMode === "inline"
          ? "relative size-full"
          : "bg-background fixed inset-0 z-50 h-screen w-screen p-4 pt-14",
        className
      )}
    >
      <div
        className={cn(
          hstack({ gap: 1, align: "center", justify: "end" }),
          "absolute inset-x-0 top-0 z-50 w-full",
          viewMode === "inline"
            ? ""
            : "shade-low border-stroke-gentle border-b p-1"
        )}
      >
        <ModeSlider
          value={modeValue}
          onChange={setModeValue}
          size={viewMode === "inline" ? "sm" : "md"}
        />
        <IconButton
          title={viewMode === "inline" ? "Maximize Editor" : "Minimize Editor"}
          size={viewMode === "inline" ? "sm" : "md"}
          icon={viewMode === "inline" ? Maximize : Minimize}
          onClick={() =>
            setViewMode(mode => (mode === "inline" ? "fullscreen" : "inline"))
          }
        />
      </div>

      <ScrollArea
        className={cn(!showCode && "hidden")}
        style={{ flex: `1 1 ${codeWidth}%` }}
      >
        <CodeEditor
          {...inputProps}
          language="markdown"
          className={inputClassName}
          showLineNumbers
        />
      </ScrollArea>

      <ScrollArea
        className={cn(!showPreview && "hidden")}
        style={{ flex: `1 1 ${previewWidth}%` }}
      >
        <MDPreview
          value={value}
          className={cn(
            "pl-4 pt-1",
            showCode && "border-stroke-gentle ml-4 border-l",
            previewClassName
          )}
        />
      </ScrollArea>
    </div>
  )
}
