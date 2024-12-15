import { it } from "vitest"

import { clamp } from "./clamp"

describe("Test clamp", () => {
  it.each`
    value | min  | max  | expected
    ${-1} | ${0} | ${2} | ${0}
    ${0}  | ${0} | ${2} | ${0}
    ${1}  | ${0} | ${2} | ${1}
    ${2}  | ${0} | ${2} | ${2}
    ${3}  | ${0} | ${2} | ${2}
  `("should clamp $value to $min and $max", ({ value, min, max, expected }) => {
    expect(clamp(value, min, max)).toBe(expected)
  })
})
