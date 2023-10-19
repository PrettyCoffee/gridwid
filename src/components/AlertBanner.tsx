import * as React from "react"

import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        neutral: "bg-background text-foreground",
        error: "border-error text-error [&>svg]:text-error",
        info: "border-info text-info [&>svg]:text-info",
        success: "border-success text-success [&>svg]:text-success",
        warning: "border-warning text-warning [&>svg]:text-warning",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  }
)

export type AlertKind = NonNullable<
  VariantProps<typeof alertVariants>["variant"]
>

const Root = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Root.displayName = "Alert"

const Title = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, children, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  >
    {children}
  </h5>
))
Title.displayName = "AlertTitle"

const Description = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-foreground [&_p]:leading-relaxed", className)}
    {...props}
  />
))
Description.displayName = "AlertDescription"

export const AlertBanner = { Root, Title, Description }
