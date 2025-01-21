import { useEffect, useState } from "react"

// eslint-disable-next-line import/no-extraneous-dependencies -- installed via rehype-katex
import "katex/dist/katex.css"
import { css } from "goober"
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

const markdownStyles = css`
  max-width: none;
  > :where(p, ul, ol) {
    max-width: 80ch;
  }

  li,
  li * {
    margin: 0;
  }
  ul,
  ol {
    padding-left: 1rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: disc;
    ul {
      list-style: square;
      ul {
        list-style: circle;
      }
    }
  }

  ol {
    list-style: decimal;
    > li > ol {
      list-style: upper-roman;
    }
  }
`

const adjustForRender = (text: string) => {
  return text.replaceAll(/^(#+)/gm, "#$1")
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
        "prose dark:prose-invert prose-zinc break-words",
        prismTheme,
        markdownStyles,
        className
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
