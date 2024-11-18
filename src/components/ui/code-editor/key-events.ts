import { Dispatch, KeyboardEvent } from "react"

import { SelectionText } from "./selection-text"
import { stopPropagation } from "./utils"

type KeyEvent = KeyboardEvent<HTMLTextAreaElement>

interface KeyEventProps {
  api: SelectionText
  event: KeyEvent
  indentWidth: number
}

interface KeyEventHandler {
  key?: string | string[]
  filter?: (event: KeyEventProps) => boolean
  handler: Dispatch<KeyEventProps>
}

const eventHandlers: KeyEventHandler[] = [
  {
    key: "enter",
    handler: ({ api }) => {
      const indent = `\n${api.getIndentText()}`
      api
        .insertText(indent)
        .position(api.start + indent.length, api.start + indent.length)
    },
  },

  {
    key: ["'", '"', "`", "[", "{", "(", "<"],
    handler: ({ event, api }) => {
      const open = event.key
      const close = {
        "[": "]",
        "{": "}",
        "(": ")",
        "<": ">",
      }[open]
      const text = `${open}${api.getSelectedValue()}${close ?? open}`
      api.insertText(text)
    },
  },

  {
    key: "tab",
    handler: ({ event, api, indentWidth }) => {
      const indent = " ".repeat(indentWidth)

      if (event.shiftKey) {
        api.lineStartRemove(indent)
        return
      }

      if (api.start !== api.end) {
        api.lineStartInsert(indent)
        return
      }

      const newPosition = api.start + indentWidth
      api.insertText(indent).position(newPosition, newPosition)
    },
  },
]

const getEventHandler = (props: KeyEventProps) => {
  const { event } = props

  const matchKey = (keys: string | string[] = [], eventKey: string) => {
    const keysArray = [keys].flat().map(key => key.toLowerCase())
    return keysArray.length === 0
      ? true
      : keysArray.map(key => key.toLowerCase()).includes(eventKey.toLowerCase())
  }

  return eventHandlers.find(({ key, filter = () => true }) => {
    return matchKey(key, event.key) && filter(props)
  })
}

export const keyEvents = (
  event: KeyboardEvent<HTMLTextAreaElement>,
  indentWidth = 2
) => {
  const api = new SelectionText(event.currentTarget)
  const handlerProps = { event, api, indentWidth }

  const eventHandler = getEventHandler(handlerProps)
  if (!eventHandler) return

  stopPropagation(event)
  eventHandler.handler(handlerProps)
  api.notifyChange()
}
