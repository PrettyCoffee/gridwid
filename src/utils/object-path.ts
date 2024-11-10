import { Prettify } from "types/util-types"

import { Indexable, isIndexable } from "./is-indexable"

type Loose<T> = Prettify<Exclude<T, undefined>>

export type ObjStringPath<TObj> = Loose<TObj> extends Indexable
  ? {
      [K in keyof Loose<TObj>]: `${Exclude<K, symbol>}${
        | ""
        | `.${ObjStringPath<Loose<TObj>[K]>}`}`
    }[keyof Loose<TObj>]
  : never

export type ObjStringPathValue<TObj, TPath> = TObj extends Indexable
  ? TPath extends `${infer Current}.${infer Next}`
    ? ObjStringPathValue<TObj[Current], Next>
    : TObj[TPath & string] | undefined
  : never

const deepGet = <TObj extends Indexable>(obj: TObj, path: string[]) => {
  const [segment, ...rest] = path
  if (!segment) return obj

  const child = obj[segment]
  if (rest.length === 0) return child
  if (isIndexable(child)) return deepGet(child, rest)
  return undefined
}

const getObjectPath = <TObj, TPath extends ObjStringPath<TObj>>(
  obj: TObj,
  path: TPath
) =>
  isIndexable(obj)
    ? (deepGet(obj, path.split(".")) as ObjStringPathValue<TObj, TPath>)
    : (undefined as ObjStringPathValue<TObj, TPath>)

const deepSet = <TObj extends Indexable>(
  obj: TObj,
  path: string[],
  value: unknown
): TObj => {
  const [key, ...rest] = path
  if (!key) return value as TObj
  const child = (obj[key] ?? {}) as Indexable
  return {
    ...obj,
    [key]: deepSet(child, rest, value),
  }
}

const setObjectPath = <TObj, TPath extends ObjStringPath<TObj>>(
  obj: TObj,
  path: TPath,
  value: ObjStringPathValue<TObj, TPath>
) => {
  const segments = path.split(".")
  return deepSet(obj as Indexable, segments, value) as TObj
}

export const objectPath = {
  get: getObjectPath,
  set: setObjectPath,
}
