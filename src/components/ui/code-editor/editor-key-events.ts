import { SelectionText } from "./selection-text"
import {
  KeyEventListener,
  KeyEventDispatcher,
} from "../../../utils/key-event-dispatcher"

interface EventExtension {
  api: SelectionText
  indentWidth: number
}

type EventListener = KeyEventListener<HTMLTextAreaElement, EventExtension>

const enterEvent: EventListener = {
  key: "enter",
  handler: ({ api }) => {
    const position = api.cursor.getPosition()
    const indent = `\n${api.getLineIndentation()}`
    api.cursor.insertText(indent)
    api.cursor.setPosition(position.start + indent.length)
  },
}

const wrapValueEvent: EventListener = {
  key: ["'", '"', "`", "[", "{", "(", "<"],
  handler: ({ event, api }) => {
    const open = event.key
    const close = {
      "[": "]",
      "{": "}",
      "(": ")",
      "<": ">",
    }[open]
    const selectedValue = api.cursor.getSelectedValue()
    const text = `${open}${selectedValue}${close ?? open}`
    api.cursor.insertText(text)
  },
}

const tabEvent: EventListener = {
  key: "tab",
  handler: ({ event, api, indentWidth }) => {
    const indent = " ".repeat(indentWidth)
    const position = api.cursor.getPosition()

    if (event.shiftKey) {
      api.lineStartRemove(indent)
      return
    }

    if (position.start !== position.end) {
      api.lineStartInsert(indent)
      return
    }

    api.cursor.insertText(indent)
    api.cursor.setPosition(position.start + indentWidth)
  },
}

const deleteEvent: EventListener = {
  key: "d",
  filter: event => event.ctrlKey,
  handler: ({ api }) => api.deleteLines(),
}

const duplicateEvent: EventListener = {
  key: "insert",
  filter: event => event.ctrlKey,
  handler: ({ api }) => api.duplicateLines(),
}

interface CreateKeyEventsProps {
  indentWidth?: number
}

export const editorKeyEvents = ({ indentWidth = 2 }: CreateKeyEventsProps) => {
  const keyEvents = new KeyEventDispatcher<HTMLTextAreaElement, EventExtension>(
    {
      getHandlerProps: event => ({
        indentWidth,
        api: new SelectionText(event.currentTarget),
      }),
    }
  )

  keyEvents
    .beforeAll(({ event }) => {
      event.preventDefault()
      event.stopPropagation()
    })
    .afterAll(({ api }) => api.notifyChange())
    .listen(enterEvent)
    .listen(wrapValueEvent)
    .listen(tabEvent)
    .listen(deleteEvent)
    .listen(duplicateEvent)

  return keyEvents
}
