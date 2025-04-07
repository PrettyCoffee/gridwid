import { Indexable } from "../utils/is-indexable"

export type Resolve<T> = {
  [K in keyof T]: T[K]
} & {}

type Loose<T> = Resolve<Exclude<T, undefined>>

export type ObjDeepPath<TObj> =
  Loose<TObj> extends Indexable
    ? {
        [K in keyof Loose<TObj>]: `${Exclude<K, symbol>}${
          | ""
          | `.${ObjDeepPath<Loose<TObj>[K]>}`}`
      }[keyof Loose<TObj>]
    : never

export type ObjDeepValue<TObj, TPath> = TObj extends Indexable
  ? TPath extends `${infer Current}.${infer Next}`
    ? ObjDeepValue<TObj[Current], Next>
    : TObj[TPath & string] | undefined
  : never
