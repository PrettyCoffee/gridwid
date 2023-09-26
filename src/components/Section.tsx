import { PropsWithChildren } from "react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Separator } from "./ui/separator"

interface SectionProps extends ClassNameProp {
  title: string
  stickyTitle?: boolean
}

export const Section = ({
  title,
  children,
  className,
  stickyTitle,
}: PropsWithChildren<SectionProps>) => (
  <div className={cn("[&:not(:last-of-type)]:mb-1", className)}>
    <div className={cn(stickyTitle && "sticky top-0 bg-card z-10")}>
      <span className="text-muted-foreground text-sm">{title}</span>
      <Separator className="mb-1" />
    </div>
    {children}
  </div>
)
Section.displayName = "Section"
