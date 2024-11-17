import { KeyboardEvent } from "react"

import { SelectionText } from "./selection-text"
import { stopPropagation } from "./utils"

/*
interface KeyEventProps {
  api: SelectionText
  event: KeyboardEvent<HTMLTextAreaElement>
  indentWidth: number
}
type KeyEvent = (props: KeyEventProps) => void
*/

// TODO: Refactor
/* eslint-disable sonarjs/cognitive-complexity */

export const keyEvents = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  indentWidth = 2
) => {
  const api = new SelectionText(event.currentTarget)
  const code = event.code.toLocaleLowerCase()
  const indent = " ".repeat(indentWidth)

  if (code === "tab") {
    stopPropagation(event)
    if (api.start === api.end) {
      if (event.shiftKey) {
        api.lineStartRemove(indent)
      } else {
        api
          .insertText(indent)
          .position(api.start + indentWidth, api.end + indentWidth)
      }
    } else if (api.getSelectedValue().includes("\n") && event.shiftKey) {
      api.lineStartRemove(indent)
    } else if (api.getSelectedValue().includes("\n")) {
      api.lineStartInsert(indent)
    } else {
      api.insertText(indent).position(api.start + indentWidth, api.end)
    }
    api.notifyChange()
  } else if (code === "enter") {
    stopPropagation(event)
    const indent = `\n${api.getIndentText()}`
    api
      .insertText(indent)
      .position(api.start + indent.length, api.start + indent.length)
    api.notifyChange()
  } else if (
    code &&
    /^(quote|backquote|bracketleft|digit9|comma)$/.test(code) &&
    api.getSelectedValue()
  ) {
    stopPropagation(event)
    const val = api.getSelectedValue()
    let txt = ""
    switch (code) {
      case "quote":
        txt = `'${val}'`
        if (event.shiftKey) {
          txt = `"${val}"`
        }
        break
      case "backquote":
        txt = `\`${val}\``
        break
      case "bracketleft":
        txt = `[${val}]`
        if (event.shiftKey) {
          txt = `{${val}}`
        }
        break
      case "digit9":
        txt = `(${val})`
        break
      case "comma":
        txt = `<${val}>`
        break
    }
    api.insertText(txt)
    api.notifyChange()
  }
}
