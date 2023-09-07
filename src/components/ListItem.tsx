import { PropsWithChildren } from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { focusRing, hover, noOverflow, press } from "~/lib/styles"
import { cn } from "~/lib/utils"

import { Polymorphic, PolymorphicProps } from "./Polymorphic"
import { Skeleton } from "./ui/skeleton"

interface ListItemRootProps {
  href?: string
  onClick?: () => void
}

const listRoot = cva(
  "py-1 px-2 text-start min-h-[theme(height.10)] flex items-center justify-start gap-2 rounded",
  {
    variants: {
      clickable: {
        true: [hover, press, focusRing],
        false: "",
      },
    },
  }
)

const splitElementProps = ({
  href,
  onClick,
}: ListItemRootProps):
  | PolymorphicProps<"a">
  | PolymorphicProps<"button">
  | PolymorphicProps<"div"> =>
  href
    ? { as: "a", href, onClick, className: listRoot({ clickable: true }) }
    : onClick
    ? { as: "button", onClick, className: listRoot({ clickable: true }) }
    : { as: "div", className: listRoot({ clickable: false }) }

export const ListItemRoot = ({
  children,
  ...rest
}: PropsWithChildren<ListItemRootProps>) => (
  <Polymorphic {...splitElementProps(rest)}>{children}</Polymorphic>
)

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
export interface ListItemCaptionProps extends VariantProps<typeof listCaption> {
  title: string
  subtitle?: string
}
const ListItemCaption = ({
  title,
  subtitle,
  ...delegated
}: ListItemCaptionProps) => {
  const className = listCaption(delegated)

  return (
    <div className={className}>
      <span className={noOverflow}>{title}</span>
      <span className={noOverflow}>{subtitle}</span>
    </div>
  )
}

const listCaptionSkeleton = cva(
  "justify-center [&>*]:max-w-full [&>:first-of-type]:w-24 [&>:last-of-type]:w-40",
  {
    variants: {
      size: {
        sm: [
          listCaption({ size: "sm" }),
          "h-9 gap-2 [&>:first-of-type]:h-3 [&>:last-of-type]:h-2",
        ],
        md: [
          listCaption({ size: "md" }),
          "h-11 gap-2 [&>:first-of-type]:h-4 [&>:last-of-type]:h-3",
        ],
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

interface ListItemCaptionSkeletonProps
  extends Pick<ListItemCaptionProps, "size"> {
  subtitle?: boolean
}
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
  Caption: ListItemCaption,
  CaptionSkeleton: ListItemCaptionSkeleton,
}
