import { PropsWithChildren } from "react"

import { ArrowLeft, Menu } from "lucide-react"

import { useDisclosure } from "hooks/use-disclosure"
import { useMountAnimation } from "hooks/use-mount-animation"
import { ClassNameProp, IconProp } from "types/base-props"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

import { IconButton } from "../ui/icon-button"

const Main = ({ children, className }: PropsWithChildren & ClassNameProp) => (
  <div className={cn(vstack({}), "h-full flex-1 overflow-hidden", className)}>
    {children}
  </div>
)

const Centered = ({
  children,
  className,
}: PropsWithChildren & ClassNameProp) => (
  <div
    className={cn(
      vstack({ align: "center", justify: "center" }),
      "h-full flex-1",
      className
    )}
  >
    {children}
  </div>
)

const Grid = ({ children }: PropsWithChildren) => <>{children}</>

interface SideAction extends Required<IconProp> {
  title: string
  to?: RoutePath
  onClick?: () => void
}

interface LayoutSideProps extends PropsWithChildren, ClassNameProp {
  back?: {
    to: RoutePath
    title: string
  }
  actions?: (SideAction | false | null | undefined)[]
}
const Side = ({ children, back, actions = [], className }: LayoutSideProps) => {
  const { isOpen, toggle } = useDisclosure(true)
  const animate = useMountAnimation({ open: isOpen, duration: 300 })

  const allActions: SideAction[] = [
    {
      title: isOpen ? "Collapse side menu" : "Expand side menu",
      onClick: toggle,
      icon: Menu,
    },
    back && { icon: ArrowLeft, ...back },
    ...actions,
  ].filter(action => !!action)

  return (
    <div className="pr-5 pb-2">
      <div
        className={cn(
          vstack(),
          "relative -ml-4 h-full py-3 pr-7 pl-3",
          "rounded-r-lg border-y border-r border-stroke-gentle",
          "transition-[max-width,min-width,padding] duration-0 ease-in-out motion-safe:duration-300",
          isOpen
            ? "min-w-[clamp(theme(width.64),20vw,theme(width.80))] max-w-[clamp(theme(width.64),20vw,theme(width.80))]"
            : "min-w-0 max-w-0 pr-3",
          className
        )}
      >
        <div
          className={cn(
            vstack({ gap: 2, align: "stretch" }),
            "-m-2 flex-1 overflow-y-scroll p-2 transition-opacity duration-0 motion-safe:duration-300",
            animate.state !== "open" && "overflow-hidden **:overflow-hidden",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {animate.mounted && children}
        </div>

        <div
          className={cn(
            vstack({}),
            "absolute top-3 -right-5 rounded-full border border-stroke-gentle bg-background-page",
            "*:rounded-full"
          )}
        >
          {allActions.map(action => (
            <IconButton key={action.title} titleSide="right" {...action} />
          ))}
        </div>
      </div>
    </div>
  )
}

const Multiple = ({
  children,
  className,
}: PropsWithChildren & ClassNameProp) => (
  <div className={cn(hstack({}), "size-full", className)}>{children}</div>
)

export const Layout = {
  Multiple,
  Centered,
  Side,
  Grid,
  Main,
}
