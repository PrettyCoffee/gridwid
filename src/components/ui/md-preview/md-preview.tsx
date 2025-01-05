import { useEffect, useState } from "react"
// eslint-disable-next-line import/no-extraneous-dependencies -- installed via rehype-katex
import "katex/dist/katex.css"
import rehypeKatex from "rehype-katex"
import rehypePrism from "rehype-prism-plus/all"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { prismTheme } from "utils/prism-theme"

const adjustForRender = (text: string) => {
  return text.replace(/^(#+)/gm, "#$1")
}

const parse = (markdown: string) =>
  unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeKatex)
    .use(rehypePrism, { ignoreMissing: true })
    .use(rehypeStringify)
    .process(adjustForRender(markdown))
    .then(result => result.toString())

export interface MDPreviewProps extends ClassNameProp {
  value: string
}

export const MDPreview = ({ value = "", className }: MDPreviewProps) => {
  const [html, setHtml] = useState("")

  useEffect(() => {
    parse(value)
      .then(setHtml)
      .catch(() => setHtml("Error: Markdown could not be parsed..."))
  }, [value])

  return (
    <div
      className={cn(
        "prose dark:prose-invert prose-zinc max-w-[80ch] break-words [&_li>p]:m-0 [&_li]:my-1",
        prismTheme,
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
