import { KeyboardEvent } from "react"
import { rehype } from "rehype"
import type { PluggableList } from "unified"

export const processHtml = (html: string, plugins: PluggableList) =>
  rehype()
    .data("settings", { fragment: true })
    .use(plugins)
    .processSync(html)
    .toString()

export const htmlEncode = (text: string) =>
  text.replace(
    /[<&"]/g,
    (char: string) =>
      ((
        {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          '"': "&quot;",
        } as Record<string, string>
      )[char] ?? char)
  )

export const stopPropagation = (event: KeyboardEvent<HTMLTextAreaElement>) => {
  event.stopPropagation()
  event.preventDefault()
}
