import { Dispatch, SetStateAction, useRef, useState } from "react"

import { css } from "goober"
import { Code, LetterText, Maximize, Minimize } from "lucide-react"

import { createAtom, useAtom } from "lib/yaasl"
import { cn } from "utils/cn"
import { hstack } from "utils/styles"

import { theme } from "../../../../tailwind/theme"
import { globalEvents } from "../../../utils/global-events"
import { KeyEventDispatcher } from "../../../utils/key-event-dispatcher"
import { zIndex } from "../../../utils/z-index"
import { ScrollArea } from "../../utility/scroll-area"
import { CodeEditor, CodeEditorProps, ShortcutsInfo } from "../code-editor"
import { IconButton } from "../icon-button"
import { MDPreview } from "../md-preview"

const trackStyles = `
  background: ${theme.read("color.stroke.default")};
  height: var(--track-width);
  border-radius: 50vh;
`

const thumbStyles = `
  appearance: none;
  height: var(--slider-size);
  width: var(--slider-size);
  background: ${theme.read("color.background.default")};
  outline: var(--track-width) solid ${theme.read("color.stroke.button")};
  margin-top: -0.4rem;
  border-radius: 50%;
  border: none;
`

const slider = css`
  --track-width: 0.125rem;
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

const modeSliderValue = createAtom({
  name: "md-editor/mode-slider-value",
  defaultValue: 50,
})

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

    const getSnappedValue = () => {
      if (value < snapOffset) return 0
      if (value > 100 - snapOffset) return 100
      if (value > 50 - snapOffset / 2 && value < 50 + snapOffset / 2) return 50

      return value
    }

    onChange(getSnappedValue())
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
        className={cn("hover:text-stroke-button", slider)}
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

const getNextLineStart = (indent: string, text: string) => {
  // All kinds of list items (unordered, ordered, checked)
  const lineStartRegex = /^(- \[ ]|- \[x]|-|>|\d+\.)?/
  let [, list] = lineStartRegex.exec(text) ?? []

  if (!list) return indent

  const number = /\d+/.exec(list)?.[0]
  if (number) {
    list = list.replace(number, String(Number(number) + 1))
  }

  return indent + list + " "
}

type ViewMode = "inline" | "fullscreen"
interface MdEditorHeaderProps {
  viewMode: ViewMode
  setViewMode: Dispatch<SetStateAction<ViewMode>>
  modeValue: number
  setModeValue: Dispatch<SetStateAction<number>>
}

const MdEditorHeader = ({
  viewMode,
  setViewMode,
  modeValue,
  setModeValue,
}: MdEditorHeaderProps) => (
  <div
    className={cn(
      hstack({ gap: 1, align: "center", justify: "end" }),
      "absolute inset-x-0 top-0 w-full",
      viewMode === "inline" ? "" : "shade-low border-stroke-gentle border-b p-1"
    )}
  >
    <ShortcutsInfo
      shortcuts={[{ keys: ["alt", "scroll"], description: "Scroll w/o sync" }]}
    />
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
)

export interface MDEditorProps
  extends Omit<
    CodeEditorProps,
    | "rehypePlugins"
    | "language"
    | "style"
    | "showLineNumbers"
    | "hideShortcuts"
    | "getNewLine"
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
  const inputScrollRef = useRef<HTMLDivElement>(null)
  const previewScrollRef = useRef<HTMLDivElement>(null)

  const { value } = inputProps
  const [modeValue, setModeValue] = useAtom(modeSliderValue)
  const [viewMode, setViewMode] = useState<ViewMode>("inline")

  const codeWidth = modeValue
  const previewWidth = 100 - modeValue

  const showCode = modeValue > 0
  const showPreview = modeValue < 100

  const scrollTrigger = useRef<number | null>(null)
  const createScrollUpdater = (activeElement: "input" | "preview") => () => {
    if (globalEvents.keys.alt.get()) return

    const { active, other } =
      activeElement === "input"
        ? {
            active: inputScrollRef.current,
            other: previewScrollRef.current,
          }
        : {
            active: previewScrollRef.current,
            other: inputScrollRef.current,
          }

    if (!active || !other || scrollTrigger.current) return

    const id = Date.now()
    scrollTrigger.current = id

    const activeScrollTop = active.scrollTop
    const activeScrollMax = active.scrollHeight - active.clientHeight

    const scrollPercent = activeScrollTop / activeScrollMax

    const otherScrollMax = other.scrollHeight - other.clientHeight
    const otherScrollTop = otherScrollMax * scrollPercent
    other.scrollTo({ top: otherScrollTop, behavior: "instant" })

    setTimeout(() => {
      if (scrollTrigger.current === id) scrollTrigger.current = null
    }, 10)
  }

  return (
    <div
      className={cn(
        hstack({}),
        "flex-1 overflow-hidden",
        viewMode === "inline"
          ? "relative size-full pt-12"
          : cn(
              "bg-background fixed inset-0 h-screen w-screen p-4 pt-20",
              zIndex.fullscreenEditor
            ),
        className
      )}
    >
      <MdEditorHeader
        modeValue={modeValue}
        setModeValue={setModeValue}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <ScrollArea
        ref={inputScrollRef}
        onScroll={createScrollUpdater("input")}
        className={cn(!showCode && "hidden")}
        style={{ flex: `1 1 ${codeWidth}%` }}
      >
        <CodeEditor
          {...inputProps}
          language="markdown"
          className={inputClassName}
          getNewLine={getNextLineStart}
          showLineNumbers
          hideShortcuts
        />
      </ScrollArea>

      <ScrollArea
        ref={previewScrollRef}
        onScroll={createScrollUpdater("preview")}
        className={cn(!showPreview && "hidden")}
        style={{ flex: `1 1 ${previewWidth}%` }}
      >
        <MDPreview
          value={value}
          className={cn(
            "px-4",
            showCode && "border-stroke-gentle ml-4 border-l",
            previewClassName
          )}
        />
      </ScrollArea>
    </div>
  )
}
