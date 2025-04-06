import { createAtom } from "lib/yaasl"

import { KeyEventDispatcher } from "./key-event-dispatcher"

type Handler = () => void

const saveHandlers = new Set<Handler>()

const altKey = createAtom({
  name: "alt-key",
  defaultValue: false,
})

const ctrlKey = createAtom({
  name: "ctrl-key",
  defaultValue: false,
})

const shiftKey = createAtom({
  name: "shift-key",
  defaultValue: false,
})

const dispatcher = new KeyEventDispatcher({})
  .listen({
    key: "s",
    type: "keydown",
    filter: event => event.ctrlKey,
    handler: ({ event }) => {
      event.preventDefault()
      saveHandlers.forEach(handler => handler())
    },
  })
  .listen({
    handler: event => {
      ctrlKey.set(event.event.ctrlKey)
      altKey.set(event.event.altKey)
      shiftKey.set(event.event.shiftKey)
    },
  })

window.addEventListener("keydown", (event: KeyboardEvent) => {
  // @ts-expect-error -- React event vs native event does not matter here
  dispatcher.emit(event)
})

window.addEventListener("keyup", (event: KeyboardEvent) => {
  // @ts-expect-error -- React event vs native event does not matter here
  dispatcher.emit(event)
})

export const globalEvents = {
  keys: {
    ctrl: ctrlKey,
    alt: altKey,
    shift: shiftKey,
  },

  onSave: {
    subscribe: (handler: Handler) => {
      saveHandlers.add(handler)
      return () => {
        saveHandlers.delete(handler)
      }
    },
  },
}
