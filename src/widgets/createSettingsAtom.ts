import { SetStateAction, useMemo } from "react"

import { atom, localStorage, reduxDevtools, useAtomValue } from "yaasl/react"

import { deepEquals } from "~/lib/deepEquals"
import { removeKeyFromObject } from "~/lib/removeKeyFromObject"
import { yaaslSetup } from "~/lib/yaaslSetup"

yaaslSetup()

export const createSettingsAtom = <T extends object>(
  name: string,
  defaultSettings: Required<T>
) => {
  const settingsAtom = atom<Record<string, Partial<T>>>({
    name,
    defaultValue: {},
    middleware: [
      localStorage(),
      reduxDevtools({ disable: !import.meta.env.DEV }),
    ],
  })

  const setSettings = (id: string, next: SetStateAction<Partial<T>>) =>
    settingsAtom.set(allSettings => {
      const settings = allSettings[id] ?? {}
      const nextSettings = next instanceof Function ? next(settings) : next
      if (Object.entries(nextSettings).length < 1) {
        return removeKeyFromObject(allSettings, id)
      }
      return { ...allSettings, [id]: nextSettings }
    })

  const isDefault = (settings: Partial<T>, key: keyof T) =>
    typeof settings[key] === "object"
      ? deepEquals(settings[key], defaultSettings[key])
      : settings[key] === defaultSettings[key]

  const setOption = <Key extends keyof T>(
    id: string,
    key: Key,
    value: T[Key]
  ) =>
    setSettings(id, settings => {
      const nextSettings = { ...settings, [key]: value }
      if (isDefault(nextSettings, key)) {
        return removeKeyFromObject(nextSettings, key) as Partial<T>
      }
      return nextSettings
    })

  const getOption = (id: string, key: keyof T) =>
    settingsAtom.get()[id]?.[key] ?? defaultSettings[key]

  const useSettings = (id: string) => {
    const settings = useAtomValue(settingsAtom)[id]
    return useMemo(() => ({ ...defaultSettings, ...settings }), [settings])
  }

  return {
    atom: settingsAtom,
    useSettings,
    setOption,
    getOption,
  }
}
