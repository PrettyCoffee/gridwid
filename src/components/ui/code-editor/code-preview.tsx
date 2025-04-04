import { useMemo } from "react"

import rehypePrism from "rehype-prism-plus/all"
import type { Pluggable, PluggableList } from "unified"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"

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

interface CodePreviewProps extends ClassNameProp {
  language: CodeLanguage
  value: string
  rehypePlugins?: PluggableList
  showLineNumbers?: boolean
}

export const CodePreview = ({
  value,
  language,
  className,
  rehypePlugins,
  showLineNumbers,
}: CodePreviewProps) => {
  const languageClass = `language-${language}`

  const plugins = useMemo(
    () =>
      mergePlugins(
        [rehypePrism, { ignoreMissing: true, showLineNumbers }],
        ...(rehypePlugins ?? [])
      ),
    [rehypePlugins, showLineNumbers]
  )

  const html = useMemo(() => {
    const code = htmlEncode(value)

    // Add a new empty line in preview, if the last line is only whitespace
    const end = /\n\s*$/.test(value) ? "<br />&nbsp;" : ""

    return processHtml(
      `<pre aria-hidden=true><code class="${languageClass}">${code}</code>${end}</pre>`,
      plugins
    )
  }, [value, languageClass, plugins])

  return useMemo(
    () => (
      <div
        className={cn(languageClass, className)}
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    ),
    [languageClass, className, html]
  )
}
