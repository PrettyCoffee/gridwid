import { HTMLProps, PropsWithChildren } from "react"

import { RoutePath } from "types/routes"

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
  const link = to != null ? `#${to}` : href
  return (
    <a ref={ref} href={link} {...props}>
      {children}
    </a>
  )
}
