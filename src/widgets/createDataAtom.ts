import { SetStateAction, useMemo } from "react"

import {
  ExpirationOptions,
  atom,
  expiration,
  indexedDb,
  reduxDevtools,
  useAtomValue,
} from "yaasl/react"

import { isProdEnv } from "~/lib/isDevEnv"
import { removeKeyFromObject } from "~/lib/removeKeyFromObject"
import { yaaslSetup } from "~/lib/yaaslSetup"

yaaslSetup()

export const createDataAtom = <T extends object | undefined>(
  name: string,
  fallback: T,
  expirationOptions?: ExpirationOptions
) => {
  const dataAtom = atom<Record<string, T>>({
    name,
    defaultValue: {},
    middleware: [
      indexedDb(),
      ...(!expirationOptions ? [] : [expiration(expirationOptions)]),
      reduxDevtools({ disable: isProdEnv }),
    ],
  })

  const getData = (id: string) => dataAtom.get()[id]

  const setData = (id: string, next: SetStateAction<T>) =>
    dataAtom.set(allData => {
      const data = allData[id] ?? fallback
      const nextData = next instanceof Function ? next(data) : next
      if (!nextData || Object.entries(nextData).length < 1) {
        return removeKeyFromObject(allData, id)
      }
      return { ...allData, [id]: nextData }
    })

  const useData = (id: string) => {
    const data = useAtomValue(dataAtom)[id]
    return useMemo(() => data ?? fallback, [data])
  }

  return {
    atom: dataAtom,
    getData,
    setData,
    useData,
  }
}
