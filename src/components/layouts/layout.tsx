import { PropsWithChildren } from "react"

import { ArrowLeft, Menu } from "lucide-react"

import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
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
    <div className="pb-2 pr-5">
      <div
        className={cn(
          vstack(),
          "relative -ml-4 h-full pl-3 pr-7 pt-3",
          "border-stroke-gentle rounded-r-lg border-y border-r",
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
            "-m-2 flex-1 p-2 transition-opacity duration-0 motion-safe:duration-300",
            animate.state !== "open" && "overflow-hidden **:overflow-hidden",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {animate.mounted && back && (
            <>
              <Button to={back.path} icon={ArrowLeft} className="justify-start">
                {back.caption}
              </Button>
              <Divider color="gentle" />
            </>
          )}

          {animate.mounted && children}
        </div>

        <div
          className={cn(
            vstack({ gap: 2 }),
            "absolute -right-5 top-3",
            "*:border-stroke-gentle *:bgl-base-background-page *:rounded-full *:border"
          )}
        >
          <IconButton
            title={isOpen ? "Collapse side menu" : "Expand side menu"}
            titleSide="right"
            onClick={toggle}
            icon={Menu}
          />
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
