import { createAtom, localStorage } from "@yaasl/react"

const counter = createAtom({
  name: "id-counter",
  defaultValue: 0,
  effects: [localStorage()],
})

export const getNextId = () => {
  counter.set(value => value + 1)
  return counter.get().toString()
}
