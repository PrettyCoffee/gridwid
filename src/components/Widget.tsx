import { PropsWithChildren } from "react"

import { VariantProps, cva } from "class-variance-authority"

import { noOverflow } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Card } from "./ui/card"

const Root = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <Card.Root
    className={cn(
      "relative w-full h-full max-h-full flex flex-col overflow-y-auto overflow-x-hidden",
      className
    )}
  >
    {children}
  </Card.Root>
)

interface WidgetHeaderProps extends ClassNameProp {
  title?: string
}
const Header = ({
  title,
  children,
  className,
}: PropsWithChildren<WidgetHeaderProps>) => (
  <div className="h-10 shrink-0 mt-1 pr-1 pl-4 flex justify-between items-center gap-2 bg-background">
    {title && (
      <span className={cn(noOverflow, "text-lg font-semibold", className)}>
        {title}
      </span>
    )}
    {children}
  </div>
)

const content = cva("px-4 mb-4", {
  variants: {
    expand: {
      true: "flex-1",
    },
    scroll: {
      true: "overflow-y-auto overflow-x-hidden",
    },
  },
  defaultVariants: {
    expand: false,
    scroll: false,
  },
})
type WidgetContentProps = VariantProps<typeof content> & ClassNameProp
const Content = ({
  children,
  className,
  ...styles
}: PropsWithChildren<WidgetContentProps>) => (
  <div className={cn(content(styles), className)}>{children}</div>
)

export const Widget = {
  Root,
  Header,
  Content,
}
