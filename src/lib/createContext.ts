import { createContext as createReactContext, useContext } from "react"

const missingProvider = (name: string) =>
  `use${name} must be used within ${name}Provider (missing-context)`

export const createContext = <ProvidedValue>(name: string) => {
  const Context = createReactContext<ProvidedValue | null>(null)
  Context.displayName = `${name}Context`

  const useOptionalContext = () => useContext(Context)

  const missingContextError = missingProvider(name)
  const useRequiredContext = () => {
    const context = useOptionalContext()
    if (context === null) {
      throw new Error(missingContextError)
    }
    return context
  }

  return {
    Provider: Context.Provider,
    useOptionalContext,
    useRequiredContext,
  }
}
