import { Dispatch, PropsWithChildren, useState } from "react"

import { createContext } from "utils/create-context"

import { EditorState } from "./types"
import { showToast } from "../toaster"

const mapKeys = <T extends EditorState, Result>(
  obj: T,
  valueMapFn: <K extends keyof T>(key: K, value: T[K]) => Result
) => {
  const entries = Object.entries(obj) as [keyof T, T[keyof T]][]

  const newEntries = entries.map(
    ([key, value]) => [key, valueMapFn(key, value)] as const
  )

  return Object.fromEntries(newEntries) as Record<keyof T, Result>
}

interface ContextState {
  getContext: (field: string) => {
    value?: string
    set: (value?: string) => void
    didChange: boolean
    isValid: boolean
  }

  save: () => void
  discard: () => void
  didChange: boolean
  isValid: boolean
}

const { Provider, useRequiredValue } = createContext<ContextState>("Editor")
export const useEditorContext = useRequiredValue

interface EditorProviderProps<TState extends EditorState> {
  subject: string
  state: TState
  setState: Dispatch<TState>
  validateFields?: {
    [K in keyof TState]?: (value: TState[K]) => boolean
  }
}
export const EditorProvider = <TState extends EditorState>({
  children,
  subject,
  state,
  setState,
  validateFields = {},
}: PropsWithChildren<EditorProviderProps<TState>>) => {
  const [draft, setDraft] = useState(state)

  const save = () => {
    setState(draft)
    showToast({
      kind: "success",
      title: `Saved ${subject}`,
    })
  }
  const discard = () => setDraft(state)

  const valid = mapKeys(
    draft,
    (field, value): boolean => validateFields[field]?.(value) ?? true
  )

  const isValid = !Object.values(valid).includes(false)

  const getContext = (field: string) => ({
    value: draft[field],
    didChange: state[field] !== draft[field],
    isValid: valid[field as keyof TState],
    set: (value?: string) => {
      setDraft(prev => ({ ...prev, [field]: value }))
    },
  })

  const didChange =
    Object.keys(draft).length !== Object.keys(state).length ||
    Object.keys(draft).some(field => draft[field] !== state[field])

  return (
    <Provider value={{ getContext, save, discard, didChange, isValid }}>
      {children}
    </Provider>
  )
}
