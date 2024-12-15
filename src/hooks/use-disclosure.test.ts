import { renderHook, act } from "@testing-library/react"
import { it } from "vitest"

import { useDisclosure } from "./use-disclosure"

describe("Test useDisclosure", () => {
  it("should open the state", () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.open()
    })

    expect(result.current.isOpen).toBe(true)
  })

  it("should close the state", () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.close()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should toggle the state", () => {
    const { result } = renderHook(() => useDisclosure())

    expect(result.current.isOpen).toBe(false)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(false)
  })

  it("should define initial state", () => {
    const { result } = renderHook(() => useDisclosure(true))

    expect(result.current.isOpen).toBe(true)

    act(() => {
      result.current.toggle()
    })

    expect(result.current.isOpen).toBe(false)
  })
})
