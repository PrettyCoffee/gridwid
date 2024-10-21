import { ArrowLeft } from "lucide-react"
import { PropsWithChildren } from "react"

import { Button } from "components/ui/button"
import { Divider } from "components/ui/divider"
import { ClassNameProp } from "types/base-props"
import { RoutePath } from "types/routes"
import { cn } from "utils/cn"
import { hstack, vstack } from "utils/styles"

const Centered = ({
  children,
  className,
}: PropsWithChildren & ClassNameProp) => (
  <div
    className={cn(
      vstack({ align: "center", justify: "center" }),
      "size-full",
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
const Side = ({ children, back, className }: LayoutSideProps) => (
  <div
    className={cn(
      vstack({ gap: 2, align: "stretch" }),
      "h-full min-w-60 max-w-60 overflow-auto p-2",
      className
    )}
  >
    {back && (
      <>
        <Button to={back.path} icon={ArrowLeft} className="justify-start">
          {back.caption}
        </Button>
        <Divider color="gentle" />
      </>
    )}

    {children}
  </div>
)

const Multiple = ({
  children,
  className,
}: PropsWithChildren & ClassNameProp) => (
  <div className={cn(hstack({ gap: 4 }), "size-full", className)}>
    {children}
  </div>
)

export const Layout = {
  Multiple,
  Centered,
  Side,
  Grid,
}
