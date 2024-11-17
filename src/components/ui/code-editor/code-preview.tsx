import { useMemo, useRef } from "react"
import rehypePrism from "rehype-prism-plus/all"
import type { Pluggable, PluggableList } from "unified"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

import * as styles from "./styles"
import { processHtml, htmlEncode } from "./utils"

export type CodeLanguage = "markdown" | "css" | "jsx"

const getPlugin = (pluggable: Pluggable) => {
  if (typeof pluggable === "function") return pluggable
  if (Array.isArray(pluggable)) return pluggable[0]
  if (pluggable.plugins) return pluggable.plugins
  return null
}
const hasPlugin = (list: PluggableList, plugin: Pluggable) =>
  list.some(listPlugin => getPlugin(listPlugin) === getPlugin(plugin))

const mergePlugins = (...plugins: PluggableList) =>
  plugins.reduce<PluggableList>((result, plugin) => {
    if (!hasPlugin(result, plugin)) result.push(plugin)
    return result
  }, [])

const pluginDiff = (a: PluggableList, b: PluggableList) => {
  if (a.length !== b.length) return true
  return a.some(plugin => !hasPlugin(b, plugin))
}

const defaultPlugins: PluggableList = [[rehypePrism, { ignoreMissing: true }]]

const useRehypePlugins = (plugins: PluggableList = []): PluggableList => {
  const withDefaults = mergePlugins(...defaultPlugins, ...plugins)

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

export const CodePreview = ({
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
