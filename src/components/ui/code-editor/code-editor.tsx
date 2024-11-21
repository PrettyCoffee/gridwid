import { css } from "goober"
import {
  Dispatch,
  TextareaHTMLAttributes,
  ChangeEvent,
  forwardRef,
  useMemo,
} from "react"
import type { PluggableList } from "unified"

import { ClassNameProp, DisableProp } from "types/base-props"
import { cn } from "utils/cn"

import { CodeLanguage, CodePreview } from "./code-preview"
import { editorKeyEvents } from "./editor-key-events"
import { ShortcutsInfo } from "./shortcuts-info"
import { rehypeTheme } from "./styles"

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
  padding: 1rem;
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
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      value,
      placeholder = "Type here...",
      language,
      className,
      style,
      rehypePlugins,
      onChange,
      readOnly,
      onSave,
      ...textAreaProps
    },
    textAreaRef
  ) => {
    const keyEvents = useMemo(() => {
      const keyEvents = editorKeyEvents({})

      keyEvents.listen({
        key: "s",
        filter: event => event.ctrlKey,
        handler: () => onSave?.(),
      })

      return keyEvents
    }, [onSave])

    const handleChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) =>
      onChange(target.value)

    return (
      <div
        style={style}
        className={cn(
          "relative overflow-hidden rounded-sm text-left font-mono text-sm font-normal selection:bg-white/15",
          rehypeTheme,
          className
        )}
      >
        <div className={"absolute right-1 top-1 z-20"}>
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
            "placeholder:text-text-gentle absolute left-0 top-0 size-full resize-none overflow-hidden",
            sharedStyles,
            textAreaStyles
          )}
        />
        <CodePreview
          rehypePlugins={rehypePlugins}
          language={language}
          value={value}
          className={sharedStyles}
        />
      </div>
    )
  }
)
