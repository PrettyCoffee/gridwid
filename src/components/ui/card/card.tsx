import { PropsWithChildren, ReactNode } from "react"

import { ClassNameProp } from "types/base-props"
import { cn } from "utils/cn"
import { surface } from "utils/styles"

export interface CardProps extends ClassNameProp {
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
      <Headline className="text-text-priority mb-1 font-bold">{title}</Headline>
      <p className="text-text-gentle mb-4 text-sm">{description}</p>
      {children}
    </div>
  </div>
)
