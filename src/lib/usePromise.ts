import { useCallback, useEffect, useReducer, useRef } from "react"

import { useLatest } from "./useLatest"

type Status = "initial" | "pending" | "rejected" | "resolved"

interface State<T> {
  status: Status
  value: T | null
  error: Error | null
}

const initialState: State<unknown> = {
  status: "initial",
  value: null,
  error: null,
}

type Action<T> =
  | { type: "pending" }
  | { type: "resolved"; payload: T }
  | { type: "rejected"; payload: Error }

const reducer = <T>(state: State<T>, action: Action<T>): State<T> => {
  switch (action.type) {
    case "pending":
      return { ...state, status: "pending", error: null }

    case "resolved":
      return {
        ...state,
        status: "resolved",
        value: action.payload,
        error: null,
      }

    case "rejected":
      return { ...state, status: "rejected", error: action.payload }

    default:
      return state
  }
}

export const usePromise = <T>(dispatchFn: () => Promise<T>) => {
  const dispatch = useLatest(dispatchFn)
  const cancel = useRef<() => void>()
  const [state, dispatchState] = useReducer<typeof reducer<T>>(
    reducer,
    initialState as State<T>
  )

  const load = useCallback(() => {
    let canceled = false
    cancel.current = () => {
      canceled = true
    }

    dispatchState({ type: "pending" })
    dispatch
      .current()
      .then(result => {
        if (canceled) return
        dispatchState({ type: "resolved", payload: result })
      })
      .catch(error => {
        if (canceled) return
        dispatchState({ type: "rejected", payload: error as Error })
      })
  }, [dispatch])

  useEffect(() => {
    load()
    return () => cancel.current?.()
  }, [load])

  const reload = useCallback(() => {
    cancel.current?.()
    load()
  }, [load])

  return { ...state, reload }
}
