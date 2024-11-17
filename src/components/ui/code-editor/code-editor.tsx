import {
  Dispatch,
  TextareaHTMLAttributes,
  KeyboardEvent,
  ChangeEvent,
  forwardRef,
} from "react"
import type { PluggableList } from "unified"

import { ClassNameProp, DisableProp } from "types/base-props"
import { cn } from "utils/cn"

import { CodeLanguage, CodePreview } from "./code-preview"
import { keyEvents } from "./key-events"
import * as styles from "./styles"
import { rehypeTheme } from "./styles"

const classPrefix = "w-tc-editor"
const indentWidth = 2

type NativeTextAreaProps = Pick<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  | "readOnly"
  | "style"
  | "placeholder"
  | "id"
  | "onKeyDown"
  | "onFocus"
  | "onBlur"
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

  /** Support dark-mode/night-mode
   *  TODO: Remove if possible
   **/
  ["data-color-mode"]?: "dark" | "light"
}

export const CodeEditor = forwardRef<HTMLTextAreaElement, CodeEditorProps>(
  (
    {
      value,
      placeholder = "Type here...",
      language,
      "data-color-mode": dataColorMode,
      className,
      style,
      rehypePlugins,
      onChange,
      onKeyDown,
      readOnly,
      ...textAreaProps
    },
    textAreaRef
  ) => {
    const layoutStyles = cn("min-h-14 p-4")

    const handleChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) =>
      onChange(target.value)

    const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (readOnly) return
      onKeyDown?.(event)
      keyEvents(event, indentWidth)
    }

    const textareaProps: TextareaHTMLAttributes<HTMLTextAreaElement> = {
      ...textAreaProps,
      autoComplete: "off",
      autoCorrect: "off",
      spellCheck: "false",
      autoCapitalize: "off",
      readOnly,
      placeholder,
      style: {
        ...styles.editor,
        ...styles.textarea,
        ...(placeholder && !value ? { WebkitTextFillColor: "inherit" } : {}),
      },
      className: cn(layoutStyles, `${classPrefix}-text`),
      value,
      onKeyDown: handleKeyDown,
      onChange: handleChange,
    }

    return (
      <div
        style={{ ...styles.container, ...style }}
        className={cn(classPrefix, rehypeTheme, className)}
        data-color-mode={dataColorMode}
      >
        <textarea {...textareaProps} ref={textAreaRef} />
        <CodePreview
          rehypePlugins={rehypePlugins}
          language={language}
          value={value}
          className={cn(layoutStyles, `${classPrefix}-preview`)}
        />
      </div>
    )
  }
)
