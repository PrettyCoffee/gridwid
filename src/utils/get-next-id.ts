import { createAtom, localStorage } from "lib/yaasl"

const counter = createAtom({
  name: "id-counter",
  defaultValue: 0,
  effects: [localStorage()],
})

export const getNextId = () => {
  counter.set(value => value + 1)
  return counter.get().toString()
}
