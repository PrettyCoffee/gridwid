import { useRef } from "react"

import { Position } from "./selection-text"

interface DiffResult {
  lineA: string
  lineB: string
}
const hasMajorDiff = (a: string, b: string) => {
  if (a === b) return false

  const linesA = a.replaceAll(/\n+/g, "\n").split("\n")
  const linesB = b.replaceAll(/\n+/g, "\n").split("\n")
  if (linesA.length !== linesB.length) return "Different amount of lines"

  const [diff, ...otherDiff] = linesA.reduce<DiffResult[]>(
    (diff, lineA, index) => {
      const lineB = linesB[index] ?? ""
      if (lineA !== lineB) diff.push({ lineA, lineB })
      return diff
    },
    []
  )
  if (!diff) return false
  if (otherDiff.length > 1) return "Multiple lines changed"

  const { lineA, lineB } = diff
  const wordsA = lineA.replaceAll(/\W+/g, " ").split(" ")
  const wordsB = lineB.replaceAll(/\W+/g, " ").split(" ")
  if (wordsA.length !== wordsB.length) {
    return "Different amount of words in a line"
  }

  const amountOfChangedWords = wordsA.reduce<number>((amount, wordA, index) => {
    const wordB = wordsB[index]
    return wordA === wordB ? amount : amount + 1
  }, 0)
  return amountOfChangedWords > 1 ? "Multiple words changed" : false
}

export interface HistoryItem {
  prev?: HistoryItem
  next?: HistoryItem
  value: string
  position: Omit<Position, "direction">
  index: number
}

const getNextItem = (
  current: HistoryItem,
  value: string,
  position: Omit<Position, "direction">
) => {
  const majorChange = hasMajorDiff(current.value, current.prev?.value ?? "")
  if (majorChange) {
    const newItem = {
      prev: current,
      position,
      value,
      index: current.index + 1,
    }
    current.next = newItem
    return newItem
  }
  return {
    ...current,
    value,
    position,
  }
}

export const useChangeHistory = (initialValue: string) => {
  const initial: HistoryItem = {
    value: initialValue,
    position: { start: 0, end: 0 },
    index: 0,
  }
  const start = useRef(initial)
  const history = useRef(initial)

  const getCurrent = () => ({
    value: history.current.value,
    position: history.current.position,
  })

  return {
    getCurrent,
    push: (value: string, position: HistoryItem["position"]) => {
      if (history.current.value === value) return
      const newItem = getNextItem(history.current, value, position)
      history.current = newItem

      if (newItem.index - start.current.index > 5) {
        const newStart = start.current.next
        if (newStart) {
          newStart.prev = undefined
          start.current = newStart
        }
      }
    },
    undo: () => {
      if (history.current.prev) {
        const next = history.current
        const prev = history.current.prev
        prev.next = next
        history.current = prev
      }
      return getCurrent()
    },
    redo: () => {
      if (history.current.next) history.current = history.current.next
      return getCurrent()
    },
  }
}
