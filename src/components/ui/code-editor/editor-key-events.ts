import { createKeyEvents, KeyEventHandler } from "utils/create-key-events"

import { SelectionText } from "./selection-text"

interface EventExtension {
  api: SelectionText
  indentWidth: number
}

const defaultEventHandlers: KeyEventHandler<EventExtension>[] = [
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

interface CreateKeyEventsProps {
  additionalEvents?: KeyEventHandler<EventExtension>[]
  indentWidth?: number
}

export const editorKeyEvents = ({
  additionalEvents = [],
  indentWidth = 2,
}: CreateKeyEventsProps) => {
  const events = [...additionalEvents, ...defaultEventHandlers]

  return createKeyEvents<EventExtension>({
    events,
    afterEvent: ({ api }) => api.notifyChange(),
    extendEventProps: event => ({
      indentWidth,
      api: new SelectionText(event.currentTarget),
    }),
  })
}
