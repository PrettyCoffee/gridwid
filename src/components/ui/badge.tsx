import * as React from "react"
import { PropsWithChildren } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

import { Skeleton } from "./skeleton"
import { TitleTooltip } from "./tooltip"
import { ClassNameProp, TitleProp } from "../base/BaseProps"
import { Icon, IconProp } from "../Icon"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-sm font-semibold",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-button text-button-foreground hover:bg-button-hover",
        destructive: "border-error bg-error/10 text-error hover:bg-error/20",
        outline: "border-input bg-transparent text-foreground hover:bg-hover",
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

const Badge = ({ className, variant, title, ...props }: BadgeProps) => (
  <TitleTooltip asChild title={title}>
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  </TitleTooltip>
)

export type IconBageProps = IconProp & TitleProp & ClassNameProp
const IconBadge = ({
  icon,
  children,
  ...delegated
}: PropsWithChildren<IconBageProps>) => (
  <Badge {...delegated}>
    <Icon icon={icon} size="sm" color="muted" />
    {children}
  </Badge>
)

const BadgeSkeleton = ({ className }: ClassNameProp) => (
  <Skeleton className={cn("inline-flex rounded-full w-20 h-6", className)} />
)

export { Badge, IconBadge, BadgeSkeleton, badgeVariants }
