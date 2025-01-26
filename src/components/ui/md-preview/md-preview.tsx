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

import { interactive } from "../../../utils/styles"

const markdownStyles = css`
  max-width: none;
  > :where(p, ul, ol) {
    max-width: 80ch;
  }

  p {
    margin-top: 1.25rem;
    margin-bottom: 0.25rem;
  }

  /**
   * List
   **/
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

  /**
   * Checkbox
   **/

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
    translate: 0.375rem 0;
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
    .then(result =>
      result
        .toString()
        .replaceAll("<pre", "<div style='position: relative;'><pre")
        .replaceAll("</pre>", "</pre></div>")
    )

const addCopyButton = (pre: HTMLPreElement) => {
  pre.querySelectorAll("button").forEach(button => button.remove())

  const button = document.createElement("button")
  button.innerText = "Copy"
  button.addEventListener("click", () => {
    const code = pre.querySelector("code")?.innerText.replaceAll("\n\n", "\n")
    void navigator.clipboard.writeText(code ?? "").catch()
  })

  button.className = cn(
    interactive({ look: "flat" }),
    "absolute right-1 top-1 inline-block rounded-md px-2 py-1 [pre:not(:hover)_&]:hidden"
  )

  pre.appendChild(button)
}

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

  const initPreview = (element: HTMLDivElement | null) => {
    const pres = element?.querySelectorAll("pre")
    pres?.forEach(pre => {
      addCopyButton(pre)
    })
  }

  return (
    <div
      ref={initPreview}
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
