import { it } from "vitest"

import { objectPath } from "./object-path"

const testString = "string"
const nextString = "other-string"
const testNumber = 42
const nextNumber = 1337
const testObj = {
  str: testString,
  num: testNumber,
  deep: { deeper: { deepest: testNumber } },
}

describe("Test objectPath", () => {
  describe("getter", () => {
    it.each`
      path                     | value
      ${"str"}                 | ${testString}
      ${"num"}                 | ${testNumber}
      ${"deep"}                | ${testObj.deep}
      ${"deep.deeper"}         | ${testObj.deep.deeper}
      ${"deep.deeper.deepest"} | ${testObj.deep.deeper.deepest}
    `("Can access path $path", ({ path, value }) => {
      expect(objectPath.get(testObj, path)).toBe(value)
    })

    it("Handles undefined paths", () => {
      const testObj = {
        missing: undefined as { deep: string } | undefined,
      }
      expect(objectPath.get(testObj, "missing.deep")).toBe(undefined)
    })
  })

  describe("setter", () => {
    it("Sets a value", () => {
      const testObj = { str: testString, num: testNumber }
      let result = objectPath.set(testObj, "str", nextString)
      result = objectPath.set(result, "num", nextNumber)
      expect(result).toStrictEqual({
        str: nextString,
        num: nextNumber,
      })
    })

    it("Sets a deep value", () => {
      const testObj = { str: testString, nested: { num: testNumber } }

      expect(
        objectPath.set(testObj, "nested", { num: nextNumber })
      ).toStrictEqual({
        str: testString,
        nested: { num: nextNumber },
      })
      expect(objectPath.set(testObj, "nested.num", nextNumber)).toStrictEqual({
        str: testString,
        nested: { num: nextNumber },
      })
    })

    it("Doesn't crash if deep path is undefined", () => {
      const testObj = {
        missing: undefined as { deep: string } | undefined,
      }
      expect(objectPath.set(testObj, "missing.deep", testString)).toStrictEqual(
        { missing: { deep: testString } }
      )
    })

    it("Doesn't manipulate the original object", () => {
      const testObj = { str: testString, nested: { num: testNumber } }

      objectPath.set(testObj, "str", nextString)
      objectPath.set(testObj, "nested", { num: nextNumber })

      expect(testObj).toStrictEqual({
        str: testString,
        nested: { num: testNumber },
      })
    })
  })
})
