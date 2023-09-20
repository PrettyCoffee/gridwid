import { PropsWithChildren } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { focusRing, hover, noOverflow, press } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { ClassNameProp } from "./base/BaseProps"
import { Polymorphic } from "./Polymorphic"
import { Skeleton } from "./ui/skeleton"

interface ListItemRootProps extends ClassNameProp {
  noHover?: boolean
}

export const ListItemRoot = ({
  children,
  className,
  noHover,
}: PropsWithChildren<ListItemRootProps>) => (
  <div
    className={cn(
      "rounded-md flex items-center justify-start",
      !noHover && "hover:bg-accent/50",
      className
    )}
  >
    {children}
  </div>
)

interface ListItemClickableProps extends ClassNameProp {
  href?: string
  onClick?: () => void
  compact?: boolean
  target?: "_blank" | "_self" | "_parent" | "_top"
}

export const ListItemClickable = ({
  children,
  className,
  href,
  target,
  onClick,
  compact,
}: PropsWithChildren<ListItemClickableProps>) => {
  const props = href
    ? {
        as: "a" as const,
        onClick,
        href,
        target,
      }
    : {
        as: "button" as const,
        onClick,
      }

  return (
    <Polymorphic
      {...props}
      className={cn(
        "py-1 px-2 h-full flex-1 flex text-start items-center justify-start gap-2 rounded-md overflow-hidden",
        compact ? "min-h-[theme(height.8)]" : "min-h-[theme(height.10)]",
        hover,
        press,
        focusRing,
        className
      )}
    >
      {children}
    </Polymorphic>
  )
}

const listCaption = cva(
  cn(
    noOverflow,
    "flex flex-col text-foreground [&>*:last-of-type]:text-muted-foreground"
  ),
  {
    variants: {
      size: {
        sm: "text-sm [&>*:last-of-type]:text-xs",
        md: "text-md [&>*:last-of-type]:text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)
export interface ListItemCaptionProps
  extends VariantProps<typeof listCaption>,
    ClassNameProp {
  title: string
  subtitle?: string
}
const ListItemCaption = ({
  title,
  subtitle,
  className,
  ...styles
}: ListItemCaptionProps) => (
  <div className={cn(listCaption(styles), className)}>
    <span className={noOverflow}>{title}</span>
    <span className={noOverflow}>{subtitle}</span>
  </div>
)

const listCaptionSkeleton = cva(
  "justify-center [&>*]:max-w-full [&>:first-of-type]:w-24 [&>:last-of-type]:w-40",
  {
    variants: {
      size: {
        sm: [
          listCaption({ size: "sm" }),
          "[&>:nth-of-type(1)]:h-3 [&>:nth-of-type(2)]:h-2",
        ],
        md: [
          listCaption({ size: "md" }),
          "[&>:nth-of-type(1)]:h-4 [&>:nth-of-type(2)]:h-3",
        ],
      },
      subtitle: {
        true: "pt-1.5 pb-0.5 gap-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type ListItemCaptionSkeletonProps = VariantProps<typeof listCaptionSkeleton>
const ListItemCaptionSkeleton = ({
  size,
  subtitle,
}: ListItemCaptionSkeletonProps) => (
  <div className={listCaptionSkeleton({ size })}>
    <Skeleton />
    {subtitle && <Skeleton />}
  </div>
)

export const ListItem = {
  Root: ListItemRoot,
  Clickable: ListItemClickable,
  Caption: ListItemCaption,
  CaptionSkeleton: ListItemCaptionSkeleton,
}
