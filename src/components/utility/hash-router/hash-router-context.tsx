import {
  PropsWithChildren,
  useMemo,
  startTransition,
  useCallback,
  useEffect,
  useState,
  useId,
} from "react"

import { RoutePath } from "types/routes"
import { createContext } from "utils/create-context"

import { showDialog } from "../../ui/dialog"

const getLocationHash = () => window.location.hash.slice(1)

const setLocationHash = (hash: string) => (window.location.hash = hash)

export const useLocationHash = () => {
  const [current, setCurrent] = useState(getLocationHash() as RoutePath)

  const setPath = useCallback((path: RoutePath) => {
    startTransition(() => {
      setCurrent(path)
      setLocationHash(path)
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
  addBlocker: (id: string) => void
  removeBlocker: (id: string) => void
}

const { Provider, useRequiredValue } = createContext<ContextState>("HashRouter")

export const useHashRouterContext = useRequiredValue

const useChangeBlocker = () => {
  const [blockers, setBlockers] = useState<string[]>([])
  const blocked = blockers.length > 0

  useEffect(() => {
    if (!blocked) return

    const handleUnload = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener("beforeunload", handleUnload)
    return () => window.removeEventListener("beforeunload", handleUnload)
  }, [blocked])

  return useMemo(() => {
    const requestChange = () =>
      new Promise<boolean>(resolve => {
        if (!blocked) return resolve(true)

        showDialog({
          title: "Unsaved changes",
          description:
            "There are unsaved changes present, are you sure you want to leave without saving?",

          confirm: {
            caption: "Continue",
            look: "key",
            onClick: () => resolve(true),
          },
          cancel: {
            caption: "Cancel",
            look: "ghost",
            onClick: () => resolve(false),
          },
        })
      })

    const addBlocker = (id: string) => setBlockers(prev => [...prev, id])
    const removeBlocker = (id: string) =>
      setBlockers(prev => prev.filter(blockerId => blockerId !== id))

    return { blocked, addBlocker, removeBlocker, requestChange }
  }, [blocked])
}

export const useBlocker = (blocked: boolean) => {
  const id = useId()
  const { addBlocker, removeBlocker } = useHashRouterContext()
  useEffect(() => {
    if (!blocked) return
    addBlocker(id)
    return () => removeBlocker(id)
  }, [addBlocker, blocked, id, removeBlocker])
}

export const HashRouterProvider = ({ children }: PropsWithChildren) => {
  const { blocked, addBlocker, removeBlocker, requestChange } =
    useChangeBlocker()
  const [path, setPath] = useLocationHash()

  const contextState = useMemo<ContextState>(() => {
    const extendedSetter = (path: RoutePath) => {
      if (!blocked) setPath(path)
      void requestChange().then(confirmed => confirmed && setPath(path))
    }
    return {
      path,
      setPath: extendedSetter,
      addBlocker,
      removeBlocker,
    }
  }, [blocked, path, requestChange, addBlocker, removeBlocker, setPath])

  return <Provider value={contextState}>{children}</Provider>
}
