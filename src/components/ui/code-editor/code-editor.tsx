import {
  Dispatch,
  TextareaHTMLAttributes,
  ChangeEvent,
  useMemo,
  useEffect,
} from "react"

import { css } from "goober"
import type { PluggableList } from "unified"

import { ClassNameProp, DisableProp, RefProp } from "types/base-props"
import { cn } from "utils/cn"
import { globalEvents } from "utils/global-events"
import { prismTheme } from "utils/prism-theme"

import { CodeLanguage, CodePreview } from "./code-preview"
import { editorKeyEvents } from "./editor-key-events"
import { ShortcutsInfo } from "./shortcuts-info"
import { useChangeHistory } from "./use-change-history"

const textAreaStaticProps: TextareaHTMLAttributes<HTMLTextAreaElement> = {
  autoComplete: "off",
  autoCorrect: "off",
  spellCheck: "false",
  autoCapitalize: "off",
} as const

const textAreaStyles = css`
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  -webkit-text-fill-color: transparent;

  &::placeholder {
    -webkit-text-fill-color: initial;
  }
`

const sharedStyles = css`
  outline: 0;
  background: none;
  display: inherit;
  font-family: inherit;
  font-size: inherit;
  font-style: inherit;
  font-variant-ligatures: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  tab-size: inherit;
  text-indent: inherit;
  text-rendering: inherit;
  text-transform: inherit;
  white-space: pre-wrap;
  word-break: keep-all;
  overflow-wrap: break-word;

  min-height: 3.5rem;
  margin: 0;

  pre {
    white-space: inherit;
    font-family: inherit;
    font-size: inherit;
    code {
      font-family: inherit;
    }
  }
`

type NativeTextAreaProps = Pick<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "readOnly" | "style" | "placeholder" | "id" | "onFocus" | "onBlur"
>

export interface CodeEditorProps
  extends NativeTextAreaProps,
    RefProp<HTMLTextAreaElement>,
    ClassNameProp,
    DisableProp {
  /** The current code to display */
  value: string
  /** Handler to be called if the value changes */
  onChange: Dispatch<string>
  /** Programming language to add syntax highlighting */
  language: CodeLanguage
  /** rehypePlugins (Array.<Plugin>, default: `[[rehypePrism, { ignoreMissing: true }]]`)
   *  List of [rehype plugins](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md#list-of-plugins) to use. See the next section for examples on how to pass options
   **/
  rehypePlugins?: PluggableList
  /** Handler to be called if the user hits s + ctrl */
  onSave?: () => void
  /** Display code line numbers */
  showLineNumbers?: boolean
}

export const CodeEditor = ({
  ref: textAreaRef,
  value,
  placeholder = "Type here...",
  language,
  className,
  style,
  rehypePlugins,
  onChange,
  readOnly,
  onSave,
  showLineNumbers,
  ...textAreaProps
}: CodeEditorProps) => {
  const history = useChangeHistory(value)

  const keyEvents = useMemo(() => {
    const keyEvents = editorKeyEvents({})

    keyEvents.listen({
      key: "z",
      filter: event => event.ctrlKey,
      handler: ({ event, api }) => {
        api.cursor.setPosition({
          start: 0,
          end: history.getCurrent().value.length,
        })

        const entry = event.shiftKey ? history.redo() : history.undo()

        api.cursor.insertText(entry.value)
        api.cursor.setPosition(entry.position)
        onChange(entry.value)
      },
    })

    return keyEvents
  }, [history, onChange])

  useEffect(() => {
    if (!onSave || readOnly) return
    const unsubscribe = globalEvents.onSave.subscribe(onSave)
    return () => unsubscribe()
  })

  const handleChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) => {
    history.push(target.value, {
      start: target.selectionStart,
      end: target.selectionEnd,
    })
    onChange(target.value)
  }
  return (
    <div
      style={style}
      className={cn(
        "bg-background relative overflow-hidden rounded-sm p-4 text-left font-mono text-sm font-normal selection:bg-white/15",
        prismTheme,
        className
      )}
    >
      <div className={"absolute right-0 top-0 z-[2]"}>
        <ShortcutsInfo />
      </div>
      <textarea
        ref={textAreaRef}
        {...textAreaStaticProps}
        {...textAreaProps}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={readOnly ? undefined : handleChange}
        onKeyDown={readOnly ? undefined : event => keyEvents.emit(event)}
        className={cn(
          "placeholder:text-text-gentle absolute left-0 top-0 z-[1] size-full resize-none overflow-hidden p-4",
          sharedStyles,
          textAreaStyles
        )}
        style={{
          paddingLeft: showLineNumbers ? "calc(3ch + 1.5rem)" : undefined,
        }}
      />
      <CodePreview
        key={String(showLineNumbers)}
        rehypePlugins={rehypePlugins}
        language={language}
        value={value}
        className={sharedStyles}
        showLineNumbers={showLineNumbers}
      />
    </div>
  )
}
