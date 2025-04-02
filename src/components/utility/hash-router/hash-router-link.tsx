import { HTMLProps, PropsWithChildren } from "react"

import { RoutePath } from "types/routes"

import { useHashRouterContext } from "./hash-router-context"
import { RefProp } from "../../../types/base-props"

export interface HashRouterLinkProps extends RefProp<HTMLAnchorElement> {
  /** Strongly typed hash route for internal routing */
  to?: RoutePath
}

export const HashRouterLink = ({
  ref,
  children,
  to,
  href,
  ...props
}: PropsWithChildren<HTMLProps<HTMLAnchorElement> & HashRouterLinkProps>) => {
  const { setPath } = useHashRouterContext()
  const link = to != null ? `#${to}` : href
  return (
    <a
      ref={ref}
      href={link}
      {...props}
      onClick={e => {
        if (to == null) return
        e.preventDefault()
        setPath(to)
      }}
    >
      {children}
    </a>
  )
}
