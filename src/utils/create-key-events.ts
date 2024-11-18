import { Dispatch, KeyboardEvent } from "react"

type KeyEvent = KeyboardEvent<HTMLTextAreaElement>

interface KeyEventProps {
  event: KeyEvent
}

export interface KeyEventHandler<Extension extends object = {}> {
  key?: string | string[]
  filter?: (event: KeyEvent) => boolean
  handler: Dispatch<KeyEventProps & Extension>
}

const matchKey = (keys: string | string[] = [], eventKey: string) => {
  const keysArray = [keys].flat().map(key => key.toLowerCase())
  return keysArray.length === 0
    ? true
    : keysArray.map(key => key.toLowerCase()).includes(eventKey.toLowerCase())
}

const getEventHandlers = <Extension extends object>(
  eventHandlers: KeyEventHandler<Extension>[],
  event: KeyEvent
) => {
  return eventHandlers.filter(({ key, filter = () => true }) => {
    return matchKey(key, event.key) && filter(event)
  })
}

interface CreateKeyEventsProps<Extension extends object> {
  events: KeyEventHandler<Extension>[]
  afterEvent?: Dispatch<KeyEventProps & Extension>
  extendEventProps?: (event: KeyEvent) => Extension
  stopPropagation?: boolean
  preventDefault?: boolean
}
export const createKeyEvents = <Extension extends object = {}>({
  events,
  afterEvent,
  extendEventProps = () => ({} as Extension),
  stopPropagation = true,
  preventDefault = true,
}: CreateKeyEventsProps<Extension>) => {
  return (event: KeyEvent) => {
    const eventHandlers = getEventHandlers(events, event)
    if (eventHandlers.length === 0) return

    if (stopPropagation) event.stopPropagation()
    if (preventDefault) event.preventDefault()

    const props = { event, ...extendEventProps(event) }
    eventHandlers.forEach(({ handler }) => handler(props))
    afterEvent?.(props)
  }
}
