import { LocalStorageParser } from "yaasl/react"

const isMapEntry = (value: unknown): value is [unknown, unknown] =>
  Array.isArray(value) && value.length === 2

export const mapParser: LocalStorageParser<Map<unknown, unknown>> = {
  parse: text => {
    try {
      const value: unknown = JSON.parse(text)
      if (!Array.isArray(value) || !value.every(isMapEntry)) {
        throw new Error()
      }
      return new Map(value)
    } catch {
      throw new Error(
        "Local storage value is not a valid Map object. (mapParser.parse)"
      )
    }
  },
  stringify: value => {
    try {
      return JSON.stringify(Array.from(value.entries()))
    } catch {
      throw new Error(
        "Map contains a complex type and could not be stringified. (mapParser.stringify)"
      )
    }
  },
}
