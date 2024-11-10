import { deepLoop } from "./deep-loop"

const stringValue = "string"
const numberValue = 42

describe("Test deepLoop", () => {
  it("Loops over flat objects", () => {
    const obj = {
      key1: stringValue,
      key2: numberValue,
    }
    const handler = vi.fn()
    deepLoop(obj, handler)

    expect(handler).toHaveBeenCalledTimes(2)
    expect(handler).toHaveBeenCalledWith(["key1"], stringValue)
    expect(handler).toHaveBeenCalledWith(["key2"], numberValue)
  })

  it("Loops over nested objects", () => {
    const obj = {
      key1: stringValue,
      key2: numberValue,
      deep: {
        key3: stringValue,
        deeper: {
          key4: numberValue,
        },
      },
    }
    const handler = vi.fn()

    deepLoop(obj, handler)

    expect(handler).toHaveBeenCalledTimes(4)
    expect(handler.mock.calls).toStrictEqual([
      [["key1"], stringValue],
      [["key2"], numberValue],
      [["deep", "key3"], stringValue],
      [["deep", "deeper", "key4"], numberValue],
    ])
  })
})
