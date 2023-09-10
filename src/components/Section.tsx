import { PropsWithChildren } from "react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Separator } from "./ui/separator"

interface SectionProps extends ClassNameProp {
  title: string
}

export const Section = ({
  title,
  children,
  className,
}: PropsWithChildren<SectionProps>) => (
  <div className={cn("[&:not(:last-of-type)]:mb-1", className)}>
    <span className="text-muted-foreground text-sm">{title}</span>
    <Separator className="mb-1" />
    {children}
  </div>
)
Section.displayName = "Section"
