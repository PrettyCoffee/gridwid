import { PropsWithChildren } from "react"

import { ArrowLeft, Menu } from "lucide-react"

import { useDisclosure } from "hooks/use-disclosure"
import { useMountAnimation } from "hooks/use-mount-animation"
import { ClassNameProp } from "types/base-props"
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

interface LayoutSideProps extends PropsWithChildren, ClassNameProp {
  back?: {
    path: RoutePath
    caption: string
  }
}
const Side = ({ children, back, className }: LayoutSideProps) => {
  const { isOpen, toggle } = useDisclosure(true)
  const animate = useMountAnimation({ open: isOpen, duration: 300 })

  return (
    <div className="pr-5 pb-2">
      <div
        className={cn(
          vstack(),
          "relative -ml-4 h-full pt-3 pr-7 pl-3",
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
            "-m-2 flex-1 overflow-hidden p-2 transition-opacity duration-0 motion-safe:duration-300",
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
          <IconButton
            title={isOpen ? "Collapse side menu" : "Expand side menu"}
            titleSide="right"
            onClick={toggle}
            icon={Menu}
          />
          {back && (
            <IconButton
              title={back.caption}
              titleSide="right"
              to={back.path}
              icon={ArrowLeft}
            />
          )}
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
