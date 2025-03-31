import { SelectionText } from "./selection-text"
import {
  KeyEventListener,
  KeyEventDispatcher,
} from "../../../utils/key-event-dispatcher"

interface EventExtension {
  api: SelectionText
  getNewLine: (indent: string, text: string) => string
  indentWidth: number
}

type EventListener = KeyEventListener<HTMLTextAreaElement, EventExtension>

const getNewLineIndent = (line: string, indentWidth: number) => {
  const lineStartRegex = /^(\s*)(.*)?/
  const [, indent = "", text = ""] = lineStartRegex.exec(line) ?? []

  const amount = indent.length - (indent.length % indentWidth)
  return { indent: " ".repeat(amount), text }
}

const enterEvent: EventListener = {
  key: "enter",
  handler: ({ api, indentWidth, getNewLine }) => {
    const position = api.cursor.getPosition()
    const line = api.getLineContent()
    const { indent, text } = getNewLineIndent(line, indentWidth)
    const newLineStart = "\n" + getNewLine(indent, text)

    api.cursor.insertText(newLineStart)
    api.cursor.setPosition(position.start + newLineStart.length)
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
    const position = api.cursor.getPosition()
    if (!selectedValue) {
      api.cursor.insertText(open)
    } else {
      const text = `${open}${selectedValue}${close ?? open}`
      api.cursor.insertText(text)
    }
    api.cursor.setPosition({ start: position.start + 1, end: position.end + 1 })
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

const moveEvent: EventListener = {
  key: ["ArrowUp", "ArrowDown"],
  filter: event => event.altKey,
  handler: ({ event, api }) => {
    const key = event.key
    api.moveLines(key === "ArrowUp" ? -1 : 1)
  },
}

type CreateKeyEventsProps = Partial<
  Pick<EventExtension, "indentWidth" | "getNewLine">
>

export const editorKeyEvents = ({
  indentWidth = 2,
  getNewLine = indent => indent,
}: CreateKeyEventsProps) => {
  const keyEvents = new KeyEventDispatcher<HTMLTextAreaElement, EventExtension>(
    {
      getHandlerProps: event => ({
        indentWidth,
        getNewLine,
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
    .listen(moveEvent)

  return keyEvents
}
