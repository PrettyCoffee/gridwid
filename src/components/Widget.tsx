import { PropsWithChildren } from "react"

import { VariantProps, cva } from "class-variance-authority"

import { noOverflow } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Card } from "./ui/card"

const Root = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <Card
    className={cn(
      "w-full h-full flex flex-col overflow-y-auto overflow-x-hidden",
      className
    )}
  >
    {children}
  </Card>
)

interface WidgetHeaderProps extends ClassNameProp {
  title: string
}
const Header = ({
  title,
  children,
  className,
}: PropsWithChildren<WidgetHeaderProps>) => (
  <div className="sticky top-0 h-12 pl-4 pr-1 flex justify-between items-center gap-2 bg-card">
    <span className={cn(noOverflow, "text-lg font-semibold", className)}>
      {title}
    </span>
    {children}
  </div>
)

const content = cva("px-4 pb-4", {
  variants: {
    expand: {
      true: "flex-1",
    },
  },
  defaultVariants: {
    expand: false,
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
