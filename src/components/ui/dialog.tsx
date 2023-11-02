import * as React from "react"

import * as DialogPrimitive from "@radix-ui/react-dialog"
import { VariantProps, cva } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "~/lib/utils"

import { ClassNameProp } from "../base/BaseProps"
import { IconButton } from "../IconButton"

const Root = DialogPrimitive.Root

const Trigger = DialogPrimitive.Trigger

const Portal = DialogPrimitive.Portal

const Overlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
Overlay.displayName = DialogPrimitive.Overlay.displayName

const dialogContent = cva(
  cn(
    "fixed flex flex-col overflow-y-auto z-50 border bg-background shadow-lg",
    "inset-2 m-auto w-auto h-max max-h-[calc(100vh-theme(height.4))]",
    "sm:inset-8 sm:max-h-[calc(100vh-theme(height.16))] sm:rounded-lg",
    "duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-50 data-[state=open]:zoom-in-50 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
  ),
  {
    variants: {
      size: {
        sm: "max-w-[calc(theme(width.20)*4)]",
        md: "max-w-[calc(theme(width.20)*5)]",
        lg: "max-w-[calc(theme(width.20)*8)]",
        full: "max-w-full h-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> &
  VariantProps<typeof dialogContent>

const Content = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, size, ...props }, ref) => (
  <Portal>
    <Overlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(dialogContent({ size }), className)}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        asChild
        className="absolute right-1 top-1 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      >
        <IconButton icon={X} title="Close" hideTitle />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </Portal>
))
Content.displayName = DialogPrimitive.Content.displayName

const Header = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 p-6 pb-4 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
Header.displayName = "DialogHeader"

const Footer = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
Footer.displayName = "DialogFooter"

const Title = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
Title.displayName = DialogPrimitive.Title.displayName

const Description = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
Description.displayName = DialogPrimitive.Description.displayName

export const DialogFragments = {
  Root,
  Trigger,
  Content,
  Header,
  Footer,
  Title,
  Description,
}

export interface DialogProps
  extends Pick<DialogContentProps, "size">,
    ClassNameProp {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
}
export const Dialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  ...contentProps
}: React.PropsWithChildren<DialogProps>) => (
  <DialogFragments.Root open={open} onOpenChange={onOpenChange}>
    <DialogFragments.Content {...contentProps}>
      <DialogFragments.Header>
        <DialogFragments.Title>{title}</DialogFragments.Title>
        {description && (
          <DialogFragments.Description>
            {description}
          </DialogFragments.Description>
        )}
      </DialogFragments.Header>
      <div className="flex-1 px-6 pb-6 overflow-auto">{children}</div>
    </DialogFragments.Content>
  </DialogFragments.Root>
)
