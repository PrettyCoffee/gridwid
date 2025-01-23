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

  p {
    margin-top: 1.25rem;
    margin-bottom: 0.25rem;
  }

  li {
    margin: 0;
    padding-left: 0.5rem;
  }
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

  ul > li:has(> input[type="checkbox"]) {
    list-style: none;
  }

  input[type="checkbox"] {
    appearance: none;
    display: inline-block;
    height: 1rem;
    width: 1rem;
    position: relative;
    border: 0.0625rem solid hsla(from currentColor h s l / 50%);
    border-radius: 0.25rem;
    margin-left: -1.5rem;
    margin-right: 0.25rem;
    translate: 0 0.125rem;
  }
  input[type="checkbox"]:checked:before,
  input[type="checkbox"]:checked:after {
    content: "";
  }
  input[type="checkbox"]:before,
  input[type="checkbox"]:after {
    display: inline-block;
    background-color: currentColor;
    position: absolute;
    width: 0.125rem;
    border-radius: 0.25rem;

    top: 0.15rem;
    left: 0.0825rem;
  }
  input[type="checkbox"]:before {
    height: 0.3rem;
    rotate: -45deg;
    translate: 0.125rem 0.25rem;
    transform-origin: center;
  }
  input[type="checkbox"]:checked:after {
    height: 0.6rem;
    rotate: 45deg;
    translate: 0.375rem 0rem;
    transform-origin: center;
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
