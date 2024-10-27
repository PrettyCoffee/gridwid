import { Dispatch, PropsWithChildren, useState } from "react"

import { createContext } from "utils/create-context"

import { EditorState } from "./types"

interface ContextState {
  getContext: (field: string) => {
    value?: string
    set: (value?: string) => void
    didChange: boolean
  }

  save: () => void
  discard: () => void
  didChange: boolean
}

const { Provider, useRequiredValue } = createContext<ContextState>("Editor")
export const useEditorContext = useRequiredValue

interface EditorProviderProps<TState extends EditorState> {
  state: TState
  setState: Dispatch<TState>
}
export const EditorProvider = <TState extends EditorState>({
  children,
  state,
  setState,
}: PropsWithChildren<EditorProviderProps<TState>>) => {
  const [draft, setDraft] = useState(state)

  const save = () => setState(draft)
  const discard = () => setDraft(state)

  const getContext = (field: string) => ({
    value: draft[field],
    didChange: state[field] !== draft[field],
    set: (value?: string) => {
      setDraft(prev => ({ ...prev, [field]: value }))
    },
  })

  const didChange =
    Object.keys(draft).length !== Object.keys(state).length ||
    Object.keys(draft).some(field => draft[field] !== state[field])

  return (
    <Provider value={{ getContext, save, discard, didChange }}>
      {children}
    </Provider>
  )
}
