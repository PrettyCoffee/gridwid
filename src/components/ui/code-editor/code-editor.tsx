import {
  Dispatch,
  TextareaHTMLAttributes,
  KeyboardEvent,
  useMemo,
  ChangeEvent,
  forwardRef,
  useRef,
} from "react"
import rehypePrism from "rehype-prism-plus/all"
import type { Pluggable, PluggableList } from "unified"

import { ClassNameProp, DisableProp } from "types/base-props"
import { cn } from "utils/cn"

import { keyEvents } from "./key-events"
import * as styles from "./styles"
import { rehypeTheme } from "./styles"
import { processHtml, htmlEncode } from "./utils"

export * from "./selection-text"

type CodeLanguage = "markdown" | "css" | "jsx"

const getPlugin = (pluggable: Pluggable) => {
  if (typeof pluggable === "function") return pluggable
  if (Array.isArray(pluggable)) return pluggable[0]
  if (pluggable.plugins) return pluggable.plugins
  return null
}
const hasPlugin = (list: PluggableList, plugin: Pluggable) => {
  return list.some(listPlugin => getPlugin(listPlugin) === getPlugin(plugin))
}

const withDefaultPlugins = (plugins: PluggableList): PluggableList =>
  hasPlugin(plugins, rehypePrism)
    ? plugins
    : [[rehypePrism, { ignoreMissing: true }], ...plugins]

const pluginDiff = (a: PluggableList, b: PluggableList) => {
  if (a.length !== b.length) return true
  return a.some(plugin => !hasPlugin(b, plugin))
}
const useRehypePlugins = (plugins: PluggableList = []): PluggableList => {
  const withDefaults = withDefaultPlugins(plugins)

  const previous = useRef(withDefaults)
  if (pluginDiff(previous.current, withDefaults)) {
    previous.current = withDefaults
  }

  return previous.current
}

interface CodePreviewProps extends ClassNameProp {
  language: CodeLanguage
  value: string
  rehypePlugins?: PluggableList
}
// TODO: Make CodePreview a standalone component
const CodePreview = ({
  value,
  language,
  className,
  rehypePlugins,
}: CodePreviewProps) => {
  const plugins = useRehypePlugins(rehypePlugins)
  const languageClass = `language-${language}`

  const html = useMemo(() => {
    const code = htmlEncode(value)
    return processHtml(
      `<pre aria-hidden=true><code class="${languageClass}">${code}</code><br /></pre>`,
      plugins
    )
  }, [value, languageClass, plugins])

  return useMemo(
    () => (
      <div
        style={styles.editor}
        className={cn(languageClass, className)}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    ),
    [languageClass, className, html]
  )
}

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
