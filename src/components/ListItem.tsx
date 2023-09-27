import { PropsWithChildren } from "react"

import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { createContext } from "~/lib/createContext"
import { focusRing, hover, noOverflow, press } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { AsChildProp, ClassNameProp } from "./base/BaseProps"
import { HStack } from "./base/Stack"
import { IconButton, IconButtonProps } from "./IconButton"
import { Skeleton } from "./ui/skeleton"

interface ListItemContext {
  compact?: boolean
}
const { Provider, useRequiredContext } =
  createContext<ListItemContext>("ListItem")

export interface ListItemRootProps extends ClassNameProp {
  noHover?: boolean
  compact?: boolean
}

const ListItemRoot = ({
  children,
  className,
  noHover,
  compact,
}: PropsWithChildren<ListItemRootProps>) => (
  <Provider value={{ compact }}>
    <HStack
      items="center"
      justify="start"
      className={cn("rounded-md", !noHover && "hover:bg-accent/50", className)}
    >
      {children}
    </HStack>
  </Provider>
)

export interface ListItemClickableProps extends ClassNameProp, AsChildProp {
  href?: string
  onClick?: () => void
  target?: "_blank" | "_self" | "_parent" | "_top"
}

const ListItemClickable = ({
  children,
  className,
  href,
  target,
  onClick,
  asChild,
}: PropsWithChildren<ListItemClickableProps>) => {
  const { compact } = useRequiredContext()
  const props = href
    ? {
        onClick,
        href,
        target,
      }
    : { onClick }

  const Element = asChild ? Slot : href ? "a" : "button"

  return (
    <Element
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
    </Element>
  )
}

const listCaption = cva(
  cn(
    noOverflow,
    "flex flex-col text-foreground [&>*:nth-of-type(2)]:text-muted-foreground"
  ),
  {
    variants: {
      compact: {
        true: "text-sm [&>*:nth-of-type(2)]:text-xs",
        false: "text-md [&>*:nth-of-type(2)]:text-sm",
      },
      active: {
        true: "[&>*:nth-of-type(1)]:text-highlight-foreground",
      },
    },
    defaultVariants: {
      compact: false,
    },
  }
)
export interface ListItemCaptionProps
  extends Omit<VariantProps<typeof listCaption>, "compact">,
    ClassNameProp {
  title: string
  subtitle?: string
}
const ListItemCaption = ({
  title,
  subtitle,
  className,
  ...styles
}: ListItemCaptionProps) => {
  const { compact } = useRequiredContext()
  return (
    <div className={cn(listCaption({ compact, ...styles }), className)}>
      <span className={noOverflow}>{title}</span>
      {subtitle && <span className={noOverflow}>{subtitle}</span>}
    </div>
  )
}

const listCaptionSkeleton = cva(
  "flex justify-center [&>*]:max-w-full [&>:first-of-type]:w-24 [&>:nth-of-type(2)]:w-40",
  {
    variants: {
      compact: {
        true: [
          listCaption({ compact: true }),
          "[&>:nth-of-type(1)]:h-3 [&>:nth-of-type(2)]:h-2",
        ],
        false: [
          listCaption({ compact: false }),
          "[&>:nth-of-type(1)]:h-4 [&>:nth-of-type(2)]:h-3",
        ],
      },
      subtitle: {
        true: "pt-1.5 pb-0.5 gap-2",
      },
    },
    defaultVariants: {
      compact: false,
    },
  }
)

type ListItemCaptionSkeletonProps = Omit<
  VariantProps<typeof listCaptionSkeleton>,
  "compact"
>
const ListItemCaptionSkeleton = ({
  subtitle,
}: ListItemCaptionSkeletonProps) => {
  const { compact } = useRequiredContext()
  return (
    <div className={listCaptionSkeleton({ compact, subtitle: !!subtitle })}>
      <Skeleton />
      {subtitle && <Skeleton />}
    </div>
  )
}

type ListItemActionProps = ClassNameProp &
  Pick<IconButtonProps, "icon" | "onClick" | "title" | "hideTitle">

const ListItemAction = ({ className, ...props }: ListItemActionProps) => {
  const { compact } = useRequiredContext()
  return (
    <IconButton
      className={cn("[:not(:hover)>&]:opacity-0", className)}
      compact={compact}
      {...props}
    />
  )
}

export const ListItem = {
  Root: ListItemRoot,
  Clickable: ListItemClickable,
  Action: ListItemAction,
  Caption: ListItemCaption,
  CaptionSkeleton: ListItemCaptionSkeleton,
}
