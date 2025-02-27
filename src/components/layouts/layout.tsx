import { PropsWithChildren } from "react"

import { ArrowLeft, ArrowLeftFromLine, ArrowRightToLine } from "lucide-react"

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
  const { isOpen, open, close } = useDisclosure(true)
  const animate = useMountAnimation(isOpen, 300)

  return (
    <div
      className={cn(
        vstack(),
        "relative mr-7 h-[calc(100%+theme(spacing.4))] pr-7",
        "transition-[max-width,min-width,padding] duration-300 ease-in-out [&>*:not(:last-child)]:transition-opacity [&>*:not(:last-child)]:duration-300",
        "border-stroke-gentle border-r",
        isOpen
          ? "min-w-64 max-w-64 [&>*:not(:last-child)]:opacity-100"
          : "min-w-0 max-w-0 pr-3 [&>*:not(:last-child)]:opacity-0",
        className
      )}
    >
      <div
        className={cn(
          vstack({ gap: 2, align: "stretch" }),
          "-m-2 flex-1 p-2",
          animate.state !== "open" && "overflow-hidden [&_*]:overflow-hidden"
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

      <IconButton
        title={isOpen ? "Collapse side menu" : "Expand side menu"}
        hideTitle
        onClick={isOpen ? close : open}
        icon={isOpen ? ArrowLeftFromLine : ArrowRightToLine}
        className="border-stroke-gentle bgl-base-background-page absolute -right-5 bottom-2 rounded-full border"
      />
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
