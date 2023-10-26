import * as React from "react"

import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "~/lib/utils"

import { Skeleton as SkeletonComp } from "./skeleton"
import { ClassNameProp } from "../base/BaseProps"

const avatarCircle = cn(
  "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
)
const Root = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(avatarCircle, className)}
    {...props}
  />
))
Root.displayName = AvatarPrimitive.Root.displayName

const Image = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
Image.displayName = AvatarPrimitive.Image.displayName

const Fallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
Fallback.displayName = AvatarPrimitive.Fallback.displayName

const Skeleton = ({ className }: ClassNameProp) => (
  <SkeletonComp className={cn(avatarCircle, className)} />
)

export const Avatar = { Root, Image, Fallback, Skeleton }
