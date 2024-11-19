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
    const indent = `\n${api.getIndentText()}`
    api
      .insertText(indent)
      .position(api.start + indent.length, api.start + indent.length)
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
    const text = `${open}${api.getSelectedValue()}${close ?? open}`
    api.insertText(text)
  },
}

const tabEvent: EventListener = {
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

  return keyEvents
}
