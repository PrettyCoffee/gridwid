import { PropsWithChildren, ReactNode } from "react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

interface CardProps extends ClassNameProp {
  title: ReactNode | string
  description: ReactNode | string
  Headline?: "h2" | "h3"
}

export const Card = ({
  title,
  description,
  children,
  Headline = "h2",
  className,
}: PropsWithChildren<CardProps>) => (
  <div className="p-2">
    <div
      className={cn(
        surface({ look: "card", size: "lg" }),
        "p-4 pt-2",
        className
      )}
    >
      <Headline className="mb-1 font-bold text-text-priority">{title}</Headline>
      <p className="mb-4 text-sm text-text-gentle">{description}</p>
      {children}
    </div>
  </div>
)
