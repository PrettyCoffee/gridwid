import { forwardRef, HTMLProps } from "react"

import { RoutePath } from "types/routes"

export interface HashRouterLinkProps {
  /** Strongly typed hash route for internal routing */
  to?: RoutePath
}

export const HashRouterLink = forwardRef<
  HTMLAnchorElement,
  HTMLProps<HTMLAnchorElement> & HashRouterLinkProps
>(({ children, to, href, ...props }, ref) => {
  const link = to != null ? `#${to}` : href
  return (
    <a ref={ref} href={link} {...props}>
      {children}
    </a>
  )
})
HashRouterLink.displayName = "HashRouterLink"
