import * as React from "react"
import { PropsWithChildren } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

import { TitleTooltip } from "./tooltip"
import { ClassNameProp, TitleProp } from "../base/BaseProps"
import { Icon, IconProp } from "../Icon"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof badgeVariants> &
  TitleProp

const Badge = ({ className, variant, title, ...props }: BadgeProps) => {
  return (
    <TitleTooltip asChild title={title}>
      <div className={cn(badgeVariants({ variant }), className)} {...props} />
    </TitleTooltip>
  )
}

export type IconBageProps = IconProp & TitleProp & ClassNameProp
const IconBadge = ({
  icon,
  children,
  ...delegated
}: PropsWithChildren<IconBageProps>) => (
  <Badge variant="secondary" {...delegated}>
    <Icon icon={icon} size="sm" color="muted" />
    {children}
  </Badge>
)

export { Badge, IconBadge, badgeVariants }
