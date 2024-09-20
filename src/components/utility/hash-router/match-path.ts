import { UrlParams } from "./types"

const paramMatcher = /:[^/]+/g

const hasParams = (path: string) => !!path.match(paramMatcher)

const getParams = (matcher: string, path: string) => {
  if (!hasParams(matcher)) return null

  const pathSegments = matcher.split(paramMatcher)
  const pathParamMatcher = new RegExp(`^${pathSegments.join("([^/]+)")}$`)

  const paramValues = pathParamMatcher.exec(path)?.slice(1)
  const paramNames = pathParamMatcher
    .exec(matcher)
    ?.slice(1)
    .map(name => name.replace(":", ""))

  if (!paramValues || !paramNames) return null

  return paramNames.reduce<UrlParams>(
    (params, name, index) => ({ ...params, [name]: paramValues[index] ?? "" }),
    {}
  )
}

const removeEndSlash = (path: string) => path.replace(/\/$/, "")
const isExactMatch = (matcher: string, path: string) =>
  removeEndSlash(matcher) === removeEndSlash(path)

export const matchPath = (matcher: string, path: string): UrlParams | null => {
  const params = getParams(matcher, path)
  if (params) return params
  return isExactMatch(matcher, path) ? {} : null
}
