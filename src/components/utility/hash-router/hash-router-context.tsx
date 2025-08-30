import {
  PropsWithChildren,
  useMemo,
  startTransition,
  useCallback,
  useEffect,
  useState,
  useId,
  useRef,
} from "react"

import { RoutePath } from "types/routes"
import { createContext } from "utils/create-context"

import { showDialog } from "../../ui/dialog"

const getLocationHash = () => window.location.hash.slice(1)

const setLocationHash = (hash: string) => (window.location.hash = hash)

const useLocationHash = () => {
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

const { Provider, useRequiredValue, useOptionalValue } =
  createContext<ContextState>("HashRouter")

export const useHashRouterContext = useRequiredValue
export const useOptionalHashRouterContext = useOptionalValue

const useChangeBlocker = () => {
  const handleUnload = useRef((event: BeforeUnloadEvent) =>
    event.preventDefault()
  )
  const current = useRef<string[]>([])
  const isBlocked = useRef(false)

  const addBlocker = useCallback((id: string) => {
    current.current = [...current.current, id]

    if (!isBlocked.current) {
      window.addEventListener("beforeunload", handleUnload.current)
      isBlocked.current = true
    }
  }, [])

  const removeBlocker = useCallback((id: string) => {
    current.current = current.current.filter(blockerId => blockerId !== id)

    if (current.current.length === 0) {
      window.removeEventListener("beforeunload", handleUnload.current)
      isBlocked.current = false
    }
  }, [])

  useEffect(
    () => () =>
      window.removeEventListener("beforeunload", handleUnload.current),
    []
  )

  const requestChange = useCallback(
    () =>
      new Promise<boolean>(resolve => {
        if (!isBlocked.current) return resolve(true)

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
      }),
    []
  )

  return { isBlocked, addBlocker, removeBlocker, requestChange }
}

export const useBlocker = (blocked: boolean) => {
  const id = useId()
  const { addBlocker, removeBlocker } = useHashRouterContext()

  useEffect(() => {
    if (blocked) addBlocker(id)
    else removeBlocker(id)

    return () => removeBlocker(id)
  }, [addBlocker, blocked, id, removeBlocker])

  return {
    addBlocker: () => addBlocker(id),
    removeBlocker: () => removeBlocker(id),
  }
}

export const HashRouterProvider = ({ children }: PropsWithChildren) => {
  const { isBlocked, addBlocker, removeBlocker, requestChange } =
    useChangeBlocker()
  const [path, setPath] = useLocationHash()

  const contextState = useMemo<ContextState>(() => {
    const extendedSetter = (path: RoutePath) => {
      if (!isBlocked.current) setPath(path)
      void requestChange().then(confirmed => confirmed && setPath(path))
    }
    return {
      path,
      setPath: extendedSetter,
      addBlocker,
      removeBlocker,
    }
  }, [isBlocked, path, requestChange, addBlocker, removeBlocker, setPath])

  return <Provider value={contextState}>{children}</Provider>
}
