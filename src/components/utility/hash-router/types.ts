import {
  FunctionComponent,
  LazyExoticComponent,
  PropsWithChildren,
} from "react"

import { RouteMeta, RoutePath } from "types/routes"

export type UrlParams = Record<string, string>

export type LazyOrFunctionComponent<Props = {}> =
  | LazyExoticComponent<FunctionComponent<Props>>
  | FunctionComponent<Props>

export interface BaseRoute {
  path: RoutePath
  meta?: RouteMeta
}

export type Route = BaseRoute & {
  Layout?: LazyOrFunctionComponent<PropsWithChildren>
  Component: LazyOrFunctionComponent
  subroutes?: Route[]
}

export interface FlatRoute {
  route: Required<BaseRoute> & { parent: Required<BaseRoute> | null }
  layouts: LazyOrFunctionComponent<PropsWithChildren>[]
  Component: LazyOrFunctionComponent
}
