import { ObjDeepValue, ObjDeepPath } from "types/util-types"

import { Indexable, isIndexable } from "./is-indexable"

const deepGet = (obj: Indexable, path: string[]) => {
  const [segment, ...rest] = path
  if (!segment) return obj

  const child = obj[segment]
  if (rest.length === 0) return child
  if (isIndexable(child)) return deepGet(child, rest)
  return undefined
}

const getObjectPath = <TObj, TPath extends ObjDeepPath<TObj>>(
  obj: TObj,
  path: TPath
) =>
  isIndexable(obj)
    ? (deepGet(obj, path.split(".")) as ObjDeepValue<TObj, TPath>)
    : (undefined as ObjDeepValue<TObj, TPath>)

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

const setObjectPath = <TObj, TPath extends ObjDeepPath<TObj>>(
  obj: TObj,
  path: TPath,
  value: ObjDeepValue<TObj, TPath>
) => {
  const segments = path.split(".")
  return deepSet(obj as Indexable, segments, value) as TObj
}

export const objectPath = {
  get: getObjectPath,
  set: setObjectPath,
}
