import { KeyEventDispatcher } from "./key-event-dispatcher"

type Handler = () => void

const saveHandlers = new Set<Handler>()

const dispatcher = new KeyEventDispatcher({})
  .beforeAll(({ event }) => event.preventDefault())
  .listen({
    key: "s",
    filter: event => event.ctrlKey,
    handler: () => {
      saveHandlers.forEach(handler => handler())
    },
  })

window.addEventListener("keydown", (event: KeyboardEvent) => {
  // @ts-expect-error -- React event vs native event does not matter here
  dispatcher.emit(event)
})

export const globalEvents = {
  onSave: {
    subscribe: (handler: Handler) => {
      saveHandlers.add(handler)
      return () => {
        saveHandlers.delete(handler)
      }
    },
  },
}
