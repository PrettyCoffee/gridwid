import {
  PropsWithChildren,
  useMemo,
  startTransition,
  useCallback,
  useEffect,
  useState,
} from "react"

import { RoutePath } from "types/routes"
import { createContext } from "utils/create-context"

const getLocationHash = () => window.location.hash.slice(1)

export const useLocationHash = () => {
  const [current, setCurrent] = useState(getLocationHash() as RoutePath)

  const setPath = useCallback((path: RoutePath) => {
    startTransition(() => {
      setCurrent(path)
      window.location.hash = path
    })
  }, [])

  useEffect(() => {
    const handleHashChange = () => setCurrent(getLocationHash() as RoutePath)
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  return [current, setPath] as const
}

interface ContextState {
  path: RoutePath
  setPath: (path: RoutePath) => void
}

const { Provider, useRequiredValue } = createContext<ContextState>("HashRouter")

export const useHashRouterContext = useRequiredValue

export const HashRouterProvider = ({ children }: PropsWithChildren) => {
  const [path, setPath] = useLocationHash()
  const contextState = useMemo(() => ({ path, setPath }), [path, setPath])
  return <Provider value={contextState}>{children}</Provider>
}
