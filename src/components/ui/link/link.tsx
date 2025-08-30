import { HTMLProps, PropsWithChildren } from "react"

import { HashRouter, HashRouterLinkProps } from "components/utility/hash-router"
import { ClassNameProp, DisableProp } from "types/base-props"
import { cn } from "utils/cn"
import { interactive } from "utils/styles"

type AnchorProps = HTMLProps<HTMLAnchorElement>
type LinkProps = ClassNameProp &
  HashRouterLinkProps &
  DisableProp &
  Pick<AnchorProps, "href" | "target">

export const Link = ({
  className,
  children,
  disabled,
  ...props
}: PropsWithChildren<LinkProps>) => (
  <HashRouter.Link
    className={cn(
      interactive({ look: "link", disabled }),
      "font-semibold text-highlight hover:underline",
      className
    )}
    disabled={disabled}
    {...props}
  >
    {children}
  </HashRouter.Link>
)
